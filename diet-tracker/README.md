
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
