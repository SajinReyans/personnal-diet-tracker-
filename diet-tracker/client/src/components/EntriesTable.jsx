import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EntriesTable({ entries, onDelete }) {
  return (
    <div className="bg-paper border-2 border-line">
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-line">
        <h3 className="font-display text-lg">Today's Log</h3>
        <span className="font-mono text-xs text-muted">{entries.length} item{entries.length === 1 ? "" : "s"}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full font-mono text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-widest text-muted border-b border-line/20">
              <th className="px-4 py-2 font-medium">Food</th>
              <th className="px-3 py-2 font-medium text-right">Cal</th>
              <th className="px-3 py-2 font-medium text-right">Protein</th>
              <th className="px-3 py-2 font-medium text-right">Carbs</th>
              <th className="px-3 py-2 font-medium text-right">Fat</th>
              <th className="px-3 py-2 w-8" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {entries.map((e) => (
                <motion.tr
                  key={e.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b border-line/10 hover:bg-cream/60 transition-colors"
                >
                  <td className="px-4 py-2 capitalize">{e.food}</td>
                  <td className="px-3 py-2 text-right text-calories">{e.calories}</td>
                  <td className="px-3 py-2 text-right text-protein">{e.protein}g</td>
                  <td className="px-3 py-2 text-right text-carbs">{e.carbs}g</td>
                  <td className="px-3 py-2 text-right text-fat">{e.fat}g</td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() => onDelete(e.id)}
                      aria-label={`Delete ${e.food}`}
                      className="text-muted hover:text-calories transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {entries.length === 0 && (
          <div className="px-4 py-8 text-center text-muted font-mono text-sm">
            Nothing logged yet — send your first meal in the chat.
          </div>
        )}
      </div>
    </div>
  );
}
