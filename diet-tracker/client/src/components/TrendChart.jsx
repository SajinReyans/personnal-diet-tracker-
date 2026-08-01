import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function formatDay(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export default function TrendChart({ history, goal }) {
  const data = history.map((h) => ({ ...h, day: formatDay(h.date) }));

  return (
    <div className="bg-paper border-2 border-line p-4">
      <h3 className="font-display text-lg mb-1">7-Day Trend</h3>
      <p className="font-mono text-[11px] text-muted mb-3">calories logged per day</p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#11111015" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontFamily: "IBM Plex Mono", fontSize: 11, fill: "#6B6A63" }}
              axisLine={{ stroke: "#111110" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontFamily: "IBM Plex Mono", fontSize: 11, fill: "#6B6A63" }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip
              contentStyle={{
                fontFamily: "IBM Plex Mono",
                fontSize: 12,
                border: "2px solid #111110",
                borderRadius: 0,
              }}
              cursor={{ fill: "#11111008" }}
            />
            <Bar dataKey="calories" fill="#E8542A" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="font-mono text-[11px] text-muted mt-2">goal: {goal.calories} cal/day</p>
    </div>
  );
}
