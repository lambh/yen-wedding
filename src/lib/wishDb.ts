import path from "path";
import fs from "fs";
import Database from "better-sqlite3";

export type WishRecord = {
  id: number;
  name: string;
  message: string;
  createdAt: string;
};

const dbPath = path.join(process.cwd(), "data", "wishes.sqlite");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS wishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

export const insertWish = (name: string, message: string): WishRecord => {
  const createdAt = new Date().toISOString();
  const stmt = db.prepare(
    "INSERT INTO wishes (name, message, created_at) VALUES (?, ?, ?)",
  );
  const result = stmt.run(name, message, createdAt);

  return {
    id: Number(result.lastInsertRowid),
    name,
    message,
    createdAt,
  };
};

export const listWishes = (limit = 50): WishRecord[] => {
  const stmt = db.prepare(
    "SELECT id, name, message, created_at as createdAt FROM wishes ORDER BY id DESC LIMIT ?",
  );
  return stmt.all(limit) as WishRecord[];
};
