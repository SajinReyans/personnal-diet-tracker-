import { useState } from "react";
import { Settings2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FIELDS = [
  { key: "calories", label: "Calories" },
  { key: "protein", label: "Protein (g)" },
  { key: "carbs", label: "Carbs (g)" },
  { key: "fat", label: "Fat (g)" },
];

export default function GoalSettings({ goal, onSave }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(goal);

  function handleOpen() {
    setDraft(goal);
    setOpen(true);
  }

  function handleSave(e) {
    e.preventDefault();
    onSave(draft);
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 font-mono text-xs text-cream/70 hover:text-cream border border-cream/20 hover:border-cream/40 rounded-sm px-2.5 py-1.5 transition-colors"
      >
        <Settings2 size={13} /> Goals
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/70 flex items-center justify-center z-50 px-4"
            onClick={() => setOpen(false)}
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSave}
              className="bg-paper border-2 border-line p-5 w-full max-w-xs font-mono"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg">Daily Goals</h3>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                {FIELDS.map((f) => (
                  <label key={f.key} className="block">
                    <span className="text-[11px] uppercase tracking-wide text-muted">{f.label}</span>
                    <input
                      type="number"
                      min="0"
                      value={draft[f.key]}
                      onChange={(e) => setDraft({ ...draft, [f.key]: Number(e.target.value) })}
                      className="w-full mt-1 border border-line/40 px-2 py-1.5 text-sm focus:border-calories"
                    />
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-line text-white py-2 text-sm hover:bg-calories transition-colors"
              >
                Save goals
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
