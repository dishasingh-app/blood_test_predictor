/**
 * biomarkers.js
 *
 * In production, this comes from your DB/API.
 * This file simulates a realistic slice of your 800 biomarkers
 * with the fields the LLM needs to reason about.
 *
 * Each biomarker has:
 *   id         — your internal ID (keep this stable)
 *   name       — full clinical name
 *   shortName  — display name for the UI
 *   category   — broad grouping
 *   conditions — health conditions this marker is relevant for
 *   description — what it measures (feeds LLM context)
 *   price      — AED, for display
 */

const biomarkers = [
  // ─── Thyroid ───────────────────────────────────────────────
  {
    id: "TSH",
    name: "Thyroid Stimulating Hormone",
    shortName: "TSH",
    category: "Thyroid",
    conditions: ["hypothyroidism", "hyperthyroidism", "hairfall", "fatigue", "weight gain", "weight loss", "cold intolerance", "infertility", "depression", "anxiety", "menstrual irregularity"],
    description: "Produced by the pituitary gland, TSH controls thyroid hormone production. Elevated TSH indicates an underactive thyroid (hypothyroidism); low TSH indicates overactivity. Thyroid dysfunction is one of the most common causes of unexplained hair loss, fatigue, and weight changes.",
    price: 45,
  },
  {
    id: "FREE_T3",
    name: "Free Triiodothyronine",
    shortName: "Free T3",
    category: "Thyroid",
    conditions: ["hypothyroidism", "hyperthyroidism", "hairfall", "fatigue", "weight gain", "brain fog", "mood swings"],
    description: "The active form of thyroid hormone that cells use directly. Free T3 can be low even when TSH appears normal — a key cause of persistent fatigue and hairfall that basic thyroid panels miss.",
    price: 55,
  },
  {
    id: "FREE_T4",
    name: "Free Thyroxine",
    shortName: "Free T4",
    category: "Thyroid",
    conditions: ["hypothyroidism", "hyperthyroidism", "hairfall", "fatigue", "weight gain"],
    description: "Precursor thyroid hormone converted to active T3. Low Free T4 with high TSH confirms hypothyroidism. Tested alongside TSH for a complete thyroid picture.",
    price: 55,
  },
  {
    id: "ANTI_TPO",
    name: "Thyroid Peroxidase Antibodies",
    shortName: "Anti-TPO",
    category: "Thyroid",
    conditions: ["hashimoto's thyroiditis", "hairfall", "autoimmune thyroid disease", "infertility", "miscarriage"],
    description: "Elevated Anti-TPO indicates an autoimmune attack on the thyroid (Hashimoto's disease) — the most common cause of hypothyroidism. Often present years before TSH becomes abnormal.",
    price: 80,
  },

  // ─── Iron & Blood ──────────────────────────────────────────
  {
    id: "FERRITIN",
    name: "Ferritin",
    shortName: "Ferritin",
    category: "Iron & Nutrition",
    conditions: ["hairfall", "hair thinning", "fatigue", "anaemia", "restless legs", "poor concentration", "pallor"],
    description: "Ferritin measures stored iron. Even without anaemia, low ferritin (below 30–70 ng/mL) is a leading cause of diffuse hair shedding in women. Hair follicles prioritise ferritin stores and stop growing hair when levels drop.",
    price: 40,
  },
  {
    id: "SERUM_IRON",
    name: "Serum Iron",
    shortName: "Serum Iron",
    category: "Iron & Nutrition",
    conditions: ["anaemia", "hairfall", "fatigue", "pallor"],
    description: "Circulating iron in the blood. Tested with TIBC to assess iron status. Low serum iron combined with low ferritin confirms iron deficiency.",
    price: 30,
  },
  {
    id: "CBC",
    name: "Complete Blood Count",
    shortName: "CBC",
    category: "Haematology",
    conditions: ["anaemia", "fatigue", "hairfall", "infection", "bruising", "pallor", "immune issues", "general health check"],
    description: "Measures red cells, white cells, haemoglobin, platelets and more. Detects anaemia (a major cause of fatigue and hairfall), infections, and clotting disorders. Standard baseline for any health assessment.",
    price: 30,
  },

  // ─── Hormones ──────────────────────────────────────────────
  {
    id: "DHT",
    name: "Dihydrotestosterone",
    shortName: "DHT",
    category: "Hormones",
    conditions: ["hairfall", "androgenic alopecia", "male pattern baldness", "female pattern hairfall", "acne", "PCOS"],
    description: "DHT is the androgen responsible for shrinking hair follicles in androgenetic alopecia (pattern baldness). Critical for diagnosing androgenic hairfall in both men and women. Elevated DHT causes miniaturisation of follicles.",
    price: 70,
  },
  {
    id: "TOTAL_TESTOSTERONE",
    name: "Total Testosterone",
    shortName: "Testosterone",
    category: "Hormones",
    conditions: ["hairfall", "PCOS", "low libido", "fatigue", "muscle loss", "acne", "infertility", "erectile dysfunction"],
    description: "Measures total circulating testosterone. Elevated levels in women suggest PCOS or adrenal issues, both linked to hair loss. Low levels in men cause fatigue, muscle loss, and hair thinning.",
    price: 60,
  },
  {
    id: "DHEA_S",
    name: "Dehydroepiandrosterone Sulfate",
    shortName: "DHEA-S",
    category: "Hormones",
    conditions: ["hairfall", "PCOS", "adrenal issues", "fatigue", "acne", "infertility"],
    description: "Adrenal androgen. Elevated DHEA-S (especially with normal testosterone) points to adrenal-source androgen excess — a common cause of hairfall and acne in women that PCOS panels often miss.",
    price: 65,
  },
  {
    id: "CORTISOL_AM",
    name: "Cortisol (Morning)",
    shortName: "Cortisol",
    category: "Hormones",
    conditions: ["fatigue", "hairfall", "weight gain", "stress", "adrenal fatigue", "anxiety", "sleep problems", "belly fat"],
    description: "Chronic stress elevates cortisol, which disrupts the hair growth cycle, promotes fat storage (especially abdominal), and suppresses thyroid and sex hormones. Measured at 8–9am for accuracy.",
    price: 60,
  },
  {
    id: "PROLACTIN",
    name: "Prolactin",
    shortName: "Prolactin",
    category: "Hormones",
    conditions: ["hairfall", "infertility", "irregular periods", "galactorrhoea", "low libido", "headaches"],
    description: "Elevated prolactin suppresses ovulation, causes hairfall, and reduces libido. Can be caused by stress, medication, or a pituitary adenoma. Often overlooked in hairfall workups.",
    price: 50,
  },
  {
    id: "INSULIN_FASTING",
    name: "Fasting Insulin",
    shortName: "Fasting Insulin",
    category: "Metabolic",
    conditions: ["PCOS", "weight gain", "insulin resistance", "hairfall", "acne", "fatigue", "type 2 diabetes risk"],
    description: "High fasting insulin indicates insulin resistance — the metabolic driver behind PCOS, which is one of the most common causes of hormonal hairfall in women. Often abnormal years before glucose becomes elevated.",
    price: 55,
  },

  // ─── Vitamins & Minerals ───────────────────────────────────
  {
    id: "VIT_D",
    name: "Vitamin D (25-OH)",
    shortName: "Vitamin D",
    category: "Vitamins",
    conditions: ["hairfall", "fatigue", "bone health", "immune issues", "mood", "muscle weakness", "depression", "general health check"],
    description: "Vitamin D receptors are found in hair follicle cells. Deficiency is extremely common in the UAE/Middle East despite sun exposure (due to indoor lifestyles) and is strongly linked to telogen effluvium (diffuse shedding).",
    price: 35,
  },
  {
    id: "VIT_B12",
    name: "Vitamin B12",
    shortName: "Vitamin B12",
    category: "Vitamins",
    conditions: ["hairfall", "fatigue", "anaemia", "nerve tingling", "brain fog", "memory", "vegetarian diet"],
    description: "B12 is essential for red blood cell formation and DNA synthesis in rapidly dividing hair cells. Deficiency causes megaloblastic anaemia and hair loss. Particularly common in vegetarians, vegans, and those with gut issues.",
    price: 42,
  },
  {
    id: "ZINC",
    name: "Zinc",
    shortName: "Zinc",
    category: "Vitamins",
    conditions: ["hairfall", "acne", "immune issues", "wound healing", "taste/smell loss", "skin issues"],
    description: "Zinc plays a direct role in hair tissue growth and repair. Zinc deficiency causes hair loss, poor wound healing, and skin problems. Levels are frequently low in people who avoid red meat or have digestive absorption issues.",
    price: 38,
  },
  {
    id: "BIOTIN",
    name: "Biotin (Vitamin B7)",
    shortName: "Biotin",
    category: "Vitamins",
    conditions: ["hairfall", "brittle nails", "skin rash", "fatigue"],
    description: "Biotin deficiency (rare but real) causes hair thinning and brittle nails. Worth testing before supplementing, as excess biotin supplementation interferes with many lab test results.",
    price: 50,
  },
  {
    id: "MAGNESIUM",
    name: "Magnesium (Serum)",
    shortName: "Magnesium",
    category: "Vitamins",
    conditions: ["fatigue", "muscle cramps", "sleep problems", "anxiety", "headaches", "hairfall"],
    description: "Magnesium is involved in over 300 enzymatic reactions. Deficiency causes muscle cramps, poor sleep, anxiety, and can contribute to hair loss. Common due to poor dietary intake and stress depletion.",
    price: 35,
  },

  // ─── Metabolic & Diabetes ──────────────────────────────────
  {
    id: "HBA1C",
    name: "Glycated Haemoglobin",
    shortName: "HbA1c",
    category: "Diabetes",
    conditions: ["diabetes", "prediabetes", "weight gain", "fatigue", "hairfall", "general health check", "PCOS", "cardiovascular risk"],
    description: "3-month average blood glucose. Elevated HbA1c indicates poor glucose control, which impairs hair follicle function and circulation. Screening recommended for anyone with weight gain, fatigue, or family history of diabetes.",
    price: 40,
  },
  {
    id: "FASTING_GLUCOSE",
    name: "Fasting Blood Glucose",
    shortName: "Fasting Glucose",
    category: "Diabetes",
    conditions: ["diabetes", "prediabetes", "weight gain", "fatigue", "general health check"],
    description: "Point-in-time blood sugar after 8-hour fast. First-line screen for diabetes and prediabetes.",
    price: 20,
  },

  // ─── Liver ────────────────────────────────────────────────
  {
    id: "LFT",
    name: "Liver Function Panel (ALT, AST, ALP, GGT, Bilirubin)",
    shortName: "Liver Function Tests",
    category: "Liver",
    conditions: ["liver disease", "fatigue", "jaundice", "alcohol use", "medication monitoring", "digestive issues", "general health check"],
    description: "Comprehensive assessment of liver health. Elevated enzymes indicate liver stress or damage. Relevant for anyone on long-term medications, with fatigue, or with digestive symptoms.",
    price: 55,
  },

  // ─── Reproductive / Fertility ──────────────────────────────
  {
    id: "AMH",
    name: "Anti-Müllerian Hormone",
    shortName: "AMH",
    category: "Fertility",
    conditions: ["infertility", "ovarian reserve", "PCOS", "early menopause", "egg freezing planning"],
    description: "Gold standard marker of ovarian reserve — the number and quality of remaining eggs. Critical for fertility planning, IVF assessment, and diagnosing PCOS (where AMH is characteristically elevated).",
    price: 120,
  },
  {
    id: "FSH",
    name: "Follicle Stimulating Hormone",
    shortName: "FSH",
    category: "Fertility",
    conditions: ["infertility", "irregular periods", "menopause", "low sperm count", "PCOS"],
    description: "Pituitary hormone that drives ovarian follicle development. Elevated FSH suggests diminished ovarian reserve. In men, elevated FSH indicates poor sperm production.",
    price: 45,
  },
  {
    id: "LH",
    name: "Luteinizing Hormone",
    shortName: "LH",
    category: "Fertility",
    conditions: ["infertility", "irregular periods", "PCOS", "ovulation tracking"],
    description: "Triggers ovulation in women and testosterone production in men. LH:FSH ratio is a key diagnostic criterion for PCOS. Tested on cycle day 2–3 for fertility workups.",
    price: 45,
  },
  {
    id: "ESTRADIOL",
    name: "Estradiol (E2)",
    shortName: "Estradiol",
    category: "Fertility",
    conditions: ["infertility", "irregular periods", "menopause", "bone health", "mood", "low libido"],
    description: "Primary oestrogen hormone. Low levels in younger women suggest premature ovarian insufficiency; elevated levels can indicate PCOS or oestrogen dominance.",
    price: 55,
  },
  {
    id: "PROGESTERONE",
    name: "Progesterone",
    shortName: "Progesterone",
    category: "Fertility",
    conditions: ["infertility", "irregular periods", "miscarriage", "luteal phase defect", "PMS"],
    description: "Measured mid-luteal phase (day 21) to confirm ovulation has occurred. Low progesterone causes irregular cycles, PMS, and implantation failure.",
    price: 50,
  },

  // ─── Lipids / Cardiovascular ───────────────────────────────
  {
    id: "LIPID_PANEL",
    name: "Full Lipid Panel (Total Cholesterol, LDL, HDL, Triglycerides)",
    shortName: "Lipid Panel",
    category: "Cardiovascular",
    conditions: ["cardiovascular risk", "weight gain", "diabetes", "metabolic syndrome", "general health check", "fatigue"],
    description: "Comprehensive cholesterol assessment. High LDL and triglycerides increase heart disease risk. Low HDL is an independent risk factor. Triglycerides are highly responsive to sugar intake and insulin resistance.",
    price: 48,
  },
  {
    id: "HS_CRP",
    name: "High-Sensitivity C-Reactive Protein",
    shortName: "hs-CRP",
    category: "Inflammation",
    conditions: ["cardiovascular risk", "chronic inflammation", "fatigue", "joint pain", "autoimmune", "general health check"],
    description: "Sensitive marker of systemic inflammation. Elevated hs-CRP predicts cardiovascular events and reflects chronic low-grade inflammation from diet, stress, or autoimmune activity.",
    price: 45,
  },

  // ─── Gut / Digestive ──────────────────────────────────────
  {
    id: "CALPROTECTIN",
    name: "Faecal Calprotectin",
    shortName: "Faecal Calprotectin",
    category: "Gut Health",
    conditions: ["IBD", "Crohn's disease", "ulcerative colitis", "digestive issues", "bloating", "chronic diarrhoea", "abdominal pain"],
    description: "Protein released by white blood cells in inflamed gut tissue. Highly specific for inflammatory bowel disease vs functional gut disorders. Stool-based test.",
    price: 90,
  },
  {
    id: "H_PYLORI_AB",
    name: "H. pylori Antibodies (IgG)",
    shortName: "H. pylori",
    category: "Gut Health",
    conditions: ["gastric ulcer", "stomach pain", "acid reflux", "nausea", "digestive issues", "bloating"],
    description: "Detects past or current H. pylori infection — the leading bacterial cause of gastric ulcers and chronic stomach inflammation. Serology-based (blood test).",
    price: 65,
  },
  {
    id: "CELIAC_TTG",
    name: "Tissue Transglutaminase IgA (tTG-IgA)",
    shortName: "Coeliac Screen",
    category: "Gut Health",
    conditions: ["coeliac disease", "gluten intolerance", "bloating", "diarrhoea", "anaemia", "hairfall", "fatigue"],
    description: "Primary screening test for coeliac disease. Coeliac causes malabsorption of iron, B12, zinc, and vitamin D — all of which cause hairfall and fatigue. Often missed without direct testing.",
    price: 75,
  },

  // ─── Kidney ───────────────────────────────────────────────
  {
    id: "UREA_CREATININE",
    name: "Urea & Creatinine (Kidney Function)",
    shortName: "Kidney Function",
    category: "Kidney",
    conditions: ["kidney disease", "dehydration", "high protein diet", "fatigue", "swelling", "general health check"],
    description: "Measures kidney filtration efficiency. Elevated creatinine or low GFR indicates impaired kidney function. Baseline for anyone taking long-term medications or with high protein intake.",
    price: 35,
  },

  // ─── Autoimmune ───────────────────────────────────────────
  {
    id: "ANA",
    name: "Antinuclear Antibodies (ANA)",
    shortName: "ANA",
    category: "Autoimmune",
    conditions: ["lupus", "autoimmune", "joint pain", "hairfall", "fatigue", "skin rash", "Raynaud's"],
    description: "Screening test for systemic autoimmune diseases including lupus (SLE), which characteristically causes diffuse hairfall, fatigue, and joint pain in young women.",
    price: 90,
  },
];

module.exports = biomarkers;
