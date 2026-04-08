require("dotenv").config();
const express = require("express");
const fs = require("fs");
const OpenAI = require("openai");
const biomarkers = require("./biomarkers");

const app = express();
app.use(express.json());
app.use(express.static("public"));

console.log(process.env.OPENAI_API_KEY);
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ─────────────────────────────────────────────
// Build biomarker context (same as yours, trimmed slightly)
// ─────────────────────────────────────────────
function buildBiomarkerContext(list) {
  return list
    .map(
      (b) => `${b.id} | ${b.name} | ${b.category} | ${b.conditions.join(", ")} | ${b.description}`
    )
    .join("\n");
}

const BIOMARKER_CONTEXT = buildBiomarkerContext(biomarkers);

// ─────────────────────────────────────────────
// Prompt
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

Return STRICT JSON:
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
// POST /api/suggest
// ─────────────────────────────────────────────
app.post("/api/suggest", async (req, res) => {
  try {
    const { concern } = req.body;

    if (!concern || concern.length < 3) {
      return res.status(400).json({ error: "Invalid concern" });
    }

    console.log(`\n[→] ${concern}`);

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a precise medical reasoning assistant.",
        },
        {
          role: "user",
          content: buildPrompt(concern),
        },
      ],
    });

    const raw = response.choices[0].message.content;
    const parsed = JSON.parse(raw);

    if (!parsed.biomarkers || parsed.biomarkers.length !== 5) {
      throw new Error("Invalid output length");
    }

    // Map with source-of-truth data
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
      model: response.model,
      usage: response.usage,
    });
  } catch (err) {
    console.error("[ERROR]", err.message);
    res.status(500).json({
      error: "AI failed to generate valid response",
    });
  }
});

// ─────────────────────────────────────────────
// Health + debug endpoints (same as yours)
// ─────────────────────────────────────────────
app.get("/api/biomarkers", (req, res) => {
  res.json({ count: biomarkers.length, biomarkers });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    biomarkersLoaded: biomarkers.length,
    model: "gpt-4.1-mini",
  });
});

// ─────────────────────────────────────────────
// Start server
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n✅ Server running at http://localhost:${PORT}`);
  console.log(`Biomarkers: ${biomarkers.length}`);
});
