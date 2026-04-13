require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const biomarkers = require("./biomarkers");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// ─────────────────────────────────────────────
// Gemini setup
// ─────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─────────────────────────────────────────────
// Build biomarker context
// ─────────────────────────────────────────────
function buildBiomarkerContext(list) {
  return list
    .map(
      (b) =>
        `${b.id} | ${b.name} | ${b.category} | ${b.conditions.join(", ")} | ${b.description}`
    )
    .join("\n");
}

const BIOMARKER_CONTEXT = buildBiomarkerContext(
  biomarkers.slice(0, 100)
);

// ─────────────────────────────────────────────
// Prompt builder
// ─────────────────────────────────────────────
function buildPrompt(concern) {
  return `
You are a clinical biomarker recommendation engine.

User concern:
"${concern}"

Available biomarkers:
${BIOMARKER_CONTEXT}

Task:
- Select EXACTLY 5 biomarkers from the list
- Focus on root causes
- Prioritize most clinically relevant

Rules:
- ONLY use biomarkers from the list
- DO NOT invent anything
- Top 3 → "high", next 2 → "medium"
- Keep reasons simple (1–2 lines)
- Rank biomarkers like a senior doctor would
- Prefer commonly used first-line screening biomarkers before advanced or niche tests.
- RETURN STRICT JSON ONLY
- NO markdown
- NO explanation

Format:
{
  "biomarkers": [
    {
      "id": "string",
      "reason": "string",
      "priority": "high | medium"
    }
  ]
}
`;
}

// ─────────────────────────────────────────────
// Extract JSON safely
// ─────────────────────────────────────────────
function extractJSON(text) {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Could not extract valid JSON");
  }
}

// ─────────────────────────────────────────────
// Gemini call with retry + fallback
// ─────────────────────────────────────────────
async function callGeminiWithFallback(prompt) {
  const MODELS = [
    "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-2.5-pro"
  ];

  for (let i = 0; i < MODELS.length; i++) {
    const modelName = MODELS[i];

    try {
      console.log(`Trying model: ${modelName}`);

      const model = genAI.getGenerativeModel({
        model: modelName,
      });

      let result;

      // 🔁 Retry once if 503
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          result = await model.generateContent(prompt);
          break;
        } catch (err) {
          if (err.message.includes("503") && attempt === 0) {
            console.log("Retrying due to 503...");
            await new Promise((res) => setTimeout(res, 1000));
          } else {
            throw err;
          }
        }
      }

      const text = result.response.text();

      return { text, modelUsed: modelName };

    } catch (err) {
      console.log(`❌ Failed with ${modelName}: ${err.message}`);

      if (i === MODELS.length - 1) {
        throw err;
      }

      await new Promise((res) => setTimeout(res, 1000));
    }
  }
}

// ─────────────────────────────────────────────
// POST /api/suggest
// ─────────────────────────────────────────────
app.post("/api/suggest", async (req, res) => {
  try {
    const { concern } = req.body;

    if (!concern || concern.length < 3) {
      return res.status(400).json({ error: "Invalid concern" });
    }

    console.log(`\n[→] Concern: ${concern}`);

    // ✅ USE FALLBACK SYSTEM
    const { text, modelUsed } = await callGeminiWithFallback(
      buildPrompt(concern)
    );

    let parsed;
    try {
      parsed = extractJSON(text);
    } catch (e) {
      console.error("Raw Gemini output:\n", text);
      throw new Error("Invalid JSON from model");
    }

    if (!parsed.biomarkers || parsed.biomarkers.length !== 5) {
      throw new Error("Invalid output length");
    }

    const enriched = parsed.biomarkers.map((item) => {
      const match = biomarkers.find((b) => b.id === item.id);

      if (!match) {
        throw new Error(`Invalid biomarker ID: ${item.id}`);
      }

      return {
        id: match.id,
        name: match.name,
        shortName: match.shortName,
        category: match.category,
        price: match.price,
        priority: item.priority,
        reason: item.reason,
      };
    });

    res.json({
      concern,
      suggestions: enriched,
      totalBiomarkersScanned: biomarkers.length,
      model: modelUsed, // ✅ dynamic
    });

  } catch (err) {
    console.error("[ERROR]", err.message);

    res.status(500).json({
      error: "AI failed to generate valid response",
    });
  }
});

// ─────────────────────────────────────────────
// Debug endpoints
// ─────────────────────────────────────────────
app.get("/api/biomarkers", (req, res) => {
  res.json({
    count: biomarkers.length,
    biomarkers,
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    biomarkersLoaded: biomarkers.length,
    model: "multi-model",
  });
});

// ─────────────────────────────────────────────
// Start server
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Valeo Biomarker API",
    endpoints: [
      "/api/suggest",
      "/api/biomarkers",
      "/api/health"
    ]
  });
});

app.listen(PORT, () => {
  console.log(`\n✅ Server running at http://localhost:${PORT}`);
  console.log(`📊 Biomarkers loaded: ${biomarkers.length}`);
});