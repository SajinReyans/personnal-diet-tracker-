const ROWS = [
  { key: "calories", label: "Calories", unit: "", color: "bg-calories" },
  { key: "protein", label: "Protein", unit: "g", color: "bg-protein" },
  { key: "carbs", label: "Carbohydrates", unit: "g", color: "bg-carbs" },
  { key: "fat", label: "Total Fat", unit: "g", color: "bg-fat" },
];

function pct(value, goal) {
  if (!goal) return 0;
  return Math.min(100, Math.round((value / goal) * 100));
}

export default function NutritionFactsPanel({ totals, goal, date }) {
  return (
    <div className="bg-paper text-line font-mono border-2 border-line p-4">
      <h2 className="font-display text-2xl leading-none tracking-tight">Nutrition Facts</h2>
      <p className="text-[11px] text-muted mt-1">{date} &middot; today's log</p>

      <div className="border-b-8 border-line my-3" />

      <div className="flex justify-between items-baseline">
        <span className="text-sm font-semibold">Calories</span>
        <span className="text-3xl font-bold">{Math.round(totals.calories)}</span>
      </div>
      <div className="flex justify-between text-[11px] text-muted -mt-1">
        <span>Daily goal</span>
        <span>{goal.calories}</span>
      </div>

      <div className="border-b-4 border-line my-3" />

      <div className="text-right text-[10px] uppercase text-muted tracking-widest mb-1">
        % of daily goal
      </div>

      <div className="space-y-3">
        {ROWS.filter((r) => r.key !== "calories").map((row) => {
          const value = totals[row.key];
          const g = goal[row.key];
          return (
            <div key={row.key} className="border-t border-line/30 pt-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">{row.label}</span>
                <span>
                  {Math.round(value)}
                  {row.unit} <span className="text-muted">/ {g}{row.unit}</span>
                </span>
              </div>
              <div className="h-1.5 bg-cream mt-1.5 overflow-hidden">
                <div
                  className={`h-full ${row.color} transition-all duration-500`}
                  style={{ width: `${pct(value, g)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t-8 border-line mt-4 pt-2 text-[10px] text-muted leading-relaxed">
        * Values are the sum of everything logged in the chat today. Percentages are relative
        to the daily goal set in Settings.
      </div>
    </div>
  );
}
