import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { createDefaultShopState, normalizeShopState } from "../src/store/defaultShopState.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultDbPath = path.resolve(__dirname, "../data/store.sqlite");
const dbPath = process.env.STORE_DB_PATH || defaultDbPath;

mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS app_state (
    id TEXT PRIMARY KEY,
    data_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

const selectState = db.prepare("SELECT data_json FROM app_state WHERE id = ?");
const upsertState = db.prepare(`
  INSERT INTO app_state (id, data_json, updated_at)
  VALUES (?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    data_json = excluded.data_json,
    updated_at = excluded.updated_at
`);
const deleteState = db.prepare("DELETE FROM app_state WHERE id = ?");

export function getState() {
  const row = selectState.get("main");
  if (!row) {
    const initial = createDefaultShopState();
    saveState(initial);
    return initial;
  }

  return normalizeShopState(JSON.parse(row.data_json));
}

export function saveState(state) {
  const normalized = normalizeShopState(state);
  upsertState.run("main", JSON.stringify(normalized), new Date().toISOString());
  return normalized;
}

export function resetState() {
  deleteState.run("main");
  return getState();
}

export function getDatabasePath() {
  return dbPath;
}
