/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14140F",
        paper: "#FFFFFF",
        cream: "#F1EEE6",
        line: "#111110",
        muted: "#6B6A63",
        calories: "#E8542A",
        protein: "#6E3FA3",
        carbs: "#C8930E",
        fat: "#1F8A70",
      },
      fontFamily: {
        display: ["'Archivo Black'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
