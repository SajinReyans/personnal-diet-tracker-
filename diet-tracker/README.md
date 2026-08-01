# Diet Log

A personal calorie/macro tracker. You type what you ate into a small chat box, a
rule-based "bot" (plain regex, no AI) reads the numbers out of your sentence,
and it drops a row into your daily log table + updates a nutrition-facts-style
summary panel and a 7-day trend chart.

## Stack
- **Frontend:** React + Vite, Tailwind CSS, Framer Motion (animations),
  Recharts (7-day chart), Lucide (icons), Axios
- **Backend:** Node.js + Express, a tiny JSON-file store (`server/data.json`,
  created automatically on first run) — no database setup required
- **Parser bot:** `server/parser.js` — pure regex/keyword matching, not an LLM

## Running it locally

Open two terminals.

**Terminal 1 — API server**
```bash
cd server
npm install
npm run dev        # http://localhost:4000
```

**Terminal 2 — frontend**
```bash
cd client
npm install
npm run dev         # http://localhost:5173
```

The Vite dev server proxies `/api` to `localhost:4000`, so just open
`http://localhost:5173`.

## How to log food

Type things like:
```
grilled chicken 250 cal 5 fat 0 carb 40 protein
rice, 200 kcal, 2g fat, 45g carbs, 4g protein
paneer tikka, 300, 18, 20, 6      <- also works: food, calories, fat, carbs, protein
banana 105 cal                     <- missing macros are just recorded as 0, bot tells you
```
The bot understands `cal/kcal/calories`, `protein`, `carb/carbs/carbohydrate`,
and `fat/fats` in either order ("5 fat" or "fat 5" or "fat: 5g").

## Editing daily goals

Click **Goals** in the top bar to set your daily calorie/protein/carb/fat
targets — the nutrition-facts panel shows progress bars against these.

## Project structure

```
diet-tracker/
├── server/
│   ├── index.js       # Express routes
│   ├── parser.js       # the log-reading bot
│   ├── db.js            # tiny JSON file store
│   └── data.json        # created on first run (entries + goal)
└── client/
    └── src/
        ├── App.jsx
        ├── api.js
        └── components/
            ├── ChatInput.jsx
            ├── EntriesTable.jsx
            ├── NutritionFactsPanel.jsx
            ├── TrendChart.jsx
            └── GoalSettings.jsx
```

## Notes
- Data is stored in `server/data.json` on disk — back it up or swap `db.js`
  for a real database (Postgres/SQLite) later without touching the routes.
- Everything is scoped to a single user; no auth layer, by design, since this
  is a personal tool.
