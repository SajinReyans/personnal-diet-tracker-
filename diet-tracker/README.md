
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
