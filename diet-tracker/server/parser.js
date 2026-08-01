// parser.js
// A small, deterministic "bot" that reads a plain-text log line and pulls out
// the food name plus calories / protein / carbs / fat. No AI involved —
// just keyword + regex matching, same idea as a supermarket receipt scanner.

const SYNONYMS = {
  calories: ["kcal", "kcals", "calorie", "calories", "cal", "cals"],
  protein: ["protein", "proteins", "prot"],
  carbs: ["carbohydrates", "carbohydrate", "carbs", "carb", "cho"],
  fat: ["fats", "fat"],
};

// Longest synonym first so "calories" matches before "cal" inside it, etc.
const ORDERED_KEYS = ["calories", "protein", "carbs", "fat"];

function buildPattern(keyword) {
  // matches "250 cal" / "250g cal" / "cal 250" / "cal: 250" / "cal - 250"
  const numBefore = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*g?\\s*(?:${keyword})\\b`, "i");
  const numAfter = new RegExp(`\\b(?:${keyword})\\s*[:\\-]?\\s*(\\d+(?:\\.\\d+)?)\\s*g?`, "i");
  return { numBefore, numAfter };
}

function extractMacro(text, macroKey) {
  const keywordGroup = SYNONYMS[macroKey]
    .slice()
    .sort((a, b) => b.length - a.length) // longest first
    .join("|");
  const { numBefore, numAfter } = buildPattern(keywordGroup);

  let match = text.match(numBefore);
  if (!match) match = text.match(numAfter);
  if (!match) return { value: null, matchedText: null };

  return { value: parseFloat(match[1]), matchedText: match[0] };
}

function stripMatched(text, matchedTexts) {
  let cleaned = text;
  for (const m of matchedTexts) {
    if (!m) continue;
    cleaned = cleaned.replace(m, " ");
  }
  // remove leftover separators/punctuation and collapse whitespace
  cleaned = cleaned
    .replace(/[,;:]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  return cleaned;
}

// Fallback: "Food name, 250, 5, 40, 20" -> calories, fat, carbs, protein in that order
function tryCsvFallback(text) {
  const parts = text.split(",").map((p) => p.trim());
  if (parts.length < 5) return null;
  const nums = parts.slice(-4);
  if (!nums.every((n) => /^\d+(\.\d+)?g?$/i.test(n))) return null;
  const [calories, fat, carbs, protein] = nums.map((n) => parseFloat(n));
  const food = parts.slice(0, parts.length - 4).join(", ").trim();
  if (!food) return null;
  return { food, calories, fat, carbs, protein };
}

/**
 * parseEntry("grilled chicken 250 cal 5 fat 0 carb 40 protein")
 * -> { food, calories, protein, carbs, fat, missing: [] }
 * If a macro can't be found, it's returned as null and listed in `missing`.
 */
export function parseEntry(rawText) {
  const text = (rawText || "").trim();
  if (!text) {
    return { ok: false, error: "Message was empty. Try: 'rice 200 cal 4 protein 45 carb 2 fat'." };
  }

  const results = {};
  const matchedTexts = [];
  for (const key of ORDERED_KEYS) {
    const { value, matchedText } = extractMacro(text, key);
    results[key] = value;
    matchedTexts.push(matchedText);
  }

  const anyFound = ORDERED_KEYS.some((k) => results[k] !== null);

  if (!anyFound) {
    const csv = tryCsvFallback(text);
    if (csv) {
      return {
        ok: true,
        food: csv.food,
        calories: csv.calories,
        fat: csv.fat,
        carbs: csv.carbs,
        protein: csv.protein,
        missing: [],
      };
    }
    return {
      ok: false,
      error:
        "Couldn't find any nutrition numbers in that message. Try something like: 'paneer 300 cal 18 fat 6 carb 20 protein'.",
    };
  }

  const food = stripMatched(text, matchedTexts) || "Unnamed item";
  const missing = ORDERED_KEYS.filter((k) => results[k] === null);

  return {
    ok: true,
    food,
    calories: results.calories,
    fat: results.fat,
    carbs: results.carbs,
    protein: results.protein,
    missing,
  };
}
