import { useEffect, useState, useCallback } from "react";
import ChatInput from "./components/ChatInput";
import EntriesTable from "./components/EntriesTable";
import NutritionFactsPanel from "./components/NutritionFactsPanel";
import TrendChart from "./components/TrendChart";
import GoalSettings from "./components/GoalSettings";
import { getEntries, deleteEntryApi, getSummary, setGoal as setGoalApi } from "./api";

const todayStr = () => new Date().toISOString().slice(0, 10);
const EMPTY_TOTALS = { calories: 0, protein: 0, carbs: 0, fat: 0 };

export default function App() {
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState({
    totals: EMPTY_TOTALS,
    history: [],
    goal: { calories: 2000, protein: 120, carbs: 250, fat: 65 },
  });

  const refresh = useCallback(async () => {
    const [entriesRes, summaryRes] = await Promise.all([getEntries(todayStr()), getSummary(todayStr())]);
    setEntries(entriesRes);
    setSummary(summaryRes);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleDelete(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    await deleteEntryApi(id);
    refresh();
  }

  async function handleSaveGoal(goal) {
    const saved = await setGoalApi(goal);
    setSummary((s) => ({ ...s, goal: saved }));
  }

  return (
    <div className="min-h-screen bg-ink">
      <header className="flex items-center justify-between px-6 py-4 border-b border-cream/10">
        <div>
          <h1 className="font-display text-cream text-xl tracking-tight">DIET LOG</h1>
          <p className="font-mono text-[11px] text-cream/40 mt-0.5">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
          </p>
        </div>
        <GoalSettings goal={summary.goal} onSave={handleSaveGoal} />
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="flex flex-col gap-6 min-w-0">
          <div className="h-[420px]">
            <ChatInput onLogged={refresh} />
          </div>
          <EntriesTable entries={entries} onDelete={handleDelete} />
        </div>

        <div className="flex flex-col gap-6 min-w-0">
          <NutritionFactsPanel totals={summary.totals} goal={summary.goal} date={todayStr()} />
          <TrendChart history={summary.history} goal={summary.goal} />
        </div>
      </main>

      <footer className="text-center font-mono text-[10px] text-cream/25 pb-6">
        Logged locally &middot; no AI, just pattern matching
      </footer>
    </div>
  );
}
