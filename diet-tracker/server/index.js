import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";
import { parseEntry } from "./parser.js";
import { getAll, addEntry, deleteEntry, getGoal, setGoal } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

function todayStr(d = new Date()) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

// --- Chat bot endpoint: parses a free-text log line and stores it ---
app.post("/api/log", (req, res) => {
  const { text } = req.body;
  const result = parseEntry(text);

  if (!result.ok) {
    return res.status(200).json({ ok: false, reply: result.error });
  }

  const entry = {
    id: nanoid(8),
    food: result.food,
    calories: result.calories ?? 0,
    protein: result.protein ?? 0,
    carbs: result.carbs ?? 0,
    fat: result.fat ?? 0,
    date: todayStr(),
    createdAt: new Date().toISOString(),
  };
  addEntry(entry);

  let reply = `Logged "${entry.food}" — ${entry.calories} cal, ${entry.protein}g protein, ${entry.carbs}g carbs, ${entry.fat}g fat.`;
  if (result.missing.length) {
    reply += ` (Assumed 0 for: ${result.missing.join(", ")} — not mentioned.)`;
  }

  res.json({ ok: true, reply, entry });
});

// --- Entries CRUD ---
app.get("/api/entries", (req, res) => {
  const { date } = req.query;
  const { entries } = getAll();
  const filtered = date ? entries.filter((e) => e.date === date) : entries;
  res.json(filtered);
});

app.delete("/api/entries/:id", (req, res) => {
  const ok = deleteEntry(req.params.id);
  res.json({ ok });
});

// --- Daily summary + simple history for charts ---
app.get("/api/summary", (req, res) => {
  const { date = todayStr() } = req.query;
  const { entries } = getAll();
  const todays = entries.filter((e) => e.date === date);

  const totals = todays.reduce(
    (acc, e) => {
      acc.calories += e.calories;
      acc.protein += e.protein;
      acc.carbs += e.carbs;
      acc.fat += e.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // last 7 days totals for the trend chart
  const byDate = {};
  for (const e of entries) {
    byDate[e.date] = byDate[e.date] || { date: e.date, calories: 0, protein: 0, carbs: 0, fat: 0 };
    byDate[e.date].calories += e.calories;
    byDate[e.date].protein += e.protein;
    byDate[e.date].carbs += e.carbs;
    byDate[e.date].fat += e.fat;
  }
  const history = Object.values(byDate)
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .slice(-7);

  res.json({ date, totals, count: todays.length, history, goal: getGoal() });
});

// --- Goal ---
app.get("/api/goal", (req, res) => res.json(getGoal()));
app.post("/api/goal", (req, res) => res.json(setGoal(req.body)));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Diet tracker API running on http://localhost:${PORT}`));
