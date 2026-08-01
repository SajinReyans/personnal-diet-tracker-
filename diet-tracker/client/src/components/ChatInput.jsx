import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, UtensilsCrossed } from "lucide-react";
import { sendLog } from "../api";

const GREETING = {
  from: "bot",
  text: "Tell me what you ate — e.g. \"grilled chicken 250 cal 5 fat 0 carb 40 protein\".",
};

export default function ChatInput({ onLogged }) {
  const [messages, setMessages] = useState([GREETING]);
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const feedRef = useRef(null);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e) {
    e.preventDefault();
    const text = value.trim();
    if (!text || sending) return;

    setMessages((m) => [...m, { from: "user", text }]);
    setValue("");
    setSending(true);

    try {
      const res = await sendLog(text);
      setMessages((m) => [...m, { from: "bot", text: res.reply, ok: res.ok }]);
      if (res.ok) onLogged?.(res.entry);
    } catch {
      setMessages((m) => [
        ...m,
        { from: "bot", text: "Couldn't reach the server — is the API running?", ok: false },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-full bg-ink rounded-none border border-line/20">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-cream/10">
        <UtensilsCrossed size={16} className="text-calories" />
        <span className="font-mono text-xs tracking-widest text-cream/70 uppercase">
          Log Bot
        </span>
      </div>

      <div ref={feedRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] font-mono text-sm px-3 py-2 rounded-sm leading-snug ${
                  m.from === "user"
                    ? "bg-cream text-ink"
                    : m.ok === false
                    ? "bg-calories/15 text-calories border border-calories/40"
                    : "bg-white/5 text-cream border border-cream/10"
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-cream/10">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. rice 200 cal 4 protein 45 carb 2 fat"
          className="flex-1 bg-white/5 text-cream placeholder:text-cream/30 font-mono text-sm px-3 py-2 rounded-sm border border-cream/10 focus:border-calories transition-colors"
        />
        <button
          type="submit"
          disabled={sending}
          className="shrink-0 bg-calories text-white p-2 rounded-sm disabled:opacity-40 hover:bg-calories/90 transition-colors"
          aria-label="Send"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
