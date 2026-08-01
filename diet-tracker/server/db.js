import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "data.json");

function load() {
  if (!existsSync(DB_PATH)) {
    const initial = { entries: [], goal: { calories: 2000, protein: 120, carbs: 250, fat: 65 } };
    writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(readFileSync(DB_PATH, "utf-8"));
}

function save(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function getAll() {
  return load();
}

export function addEntry(entry) {
  const data = load();
  data.entries.unshift(entry);
  save(data);
  return entry;
}

export function deleteEntry(id) {
  const data = load();
  const before = data.entries.length;
  data.entries = data.entries.filter((e) => e.id !== id);
  save(data);
  return data.entries.length < before;
}

export function getGoal() {
  return load().goal;
}

export function setGoal(goal) {
  const data = load();
  data.goal = { ...data.goal, ...goal };
  save(data);
  return data.goal;
}
