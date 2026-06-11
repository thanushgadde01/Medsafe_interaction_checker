import Database from 'better-sqlite3';
import path from 'path';
import type { CheckHistory } from '@/types';

let db: Database.Database | null = null;

/**
 * Initialize SQLite database
 */
export function initializeDatabase(): Database.Database {
  if (db) return db;

  const dbPath = path.join(process.cwd(), 'data', 'medsafe.db');
  db = new Database(dbPath);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS check_history (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      drugName TEXT NOT NULL,
      foodName TEXT NOT NULL,
      drugSmiles TEXT NOT NULL,
      foodSmiles TEXT NOT NULL,
      clinicalText TEXT,
      result_severity_score INTEGER NOT NULL,
      result_severity_label TEXT NOT NULL,
      result_confidence TEXT NOT NULL,
      result_probabilities JSON NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_user_id ON check_history(userId);
    CREATE INDEX IF NOT EXISTS idx_created_at ON check_history(createdAt DESC);
  `);

  return db;
}

/**
 * Get database instance
 */
export function getDatabase(): Database.Database {
  if (!db) {
    initializeDatabase();
  }
  return db!;
}

/**
 * Save check history
 */
export function saveCheckHistory(history: Omit<CheckHistory, 'id' | 'createdAt' | 'updatedAt'>): CheckHistory {
  const database = getDatabase();
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();

  const stmt = database.prepare(`
    INSERT INTO check_history (
      id, userId, drugName, foodName, drugSmiles, foodSmiles, clinicalText,
      result_severity_score, result_severity_label, result_confidence, result_probabilities,
      createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    history.userId,
    history.drugName,
    history.foodName,
    history.drugSmiles,
    history.foodSmiles,
    history.clinicalText,
    history.result.severity_score,
    history.result.severity_label,
    history.result.confidence,
    JSON.stringify(history.result.raw_probabilities),
    now.toISOString(),
    now.toISOString()
  );

  return {
    ...history,
    id,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Get user's check history
 */
export function getUserCheckHistory(userId: string, limit: number = 50): CheckHistory[] {
  const database = getDatabase();

  const stmt = database.prepare(`
    SELECT * FROM check_history
    WHERE userId = ?
    ORDER BY createdAt DESC
    LIMIT ?
  `);

  const rows = stmt.all(userId, limit) as any[];

  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    drugName: row.drugName,
    foodName: row.foodName,
    drugSmiles: row.drugSmiles,
    foodSmiles: row.foodSmiles,
    clinicalText: row.clinicalText,
    result: {
      severity_score: row.result_severity_score,
      severity_label: row.result_severity_label,
      confidence: row.result_confidence,
      raw_probabilities: JSON.parse(row.result_probabilities),
    },
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  }));
}

/**
 * Get specific check by ID
 */
export function getCheckById(id: string): CheckHistory | null {
  const database = getDatabase();

  const stmt = database.prepare(`
    SELECT * FROM check_history WHERE id = ?
  `);

  const row = stmt.get(id) as any;

  if (!row) return null;

  return {
    id: row.id,
    userId: row.userId,
    drugName: row.drugName,
    foodName: row.foodName,
    drugSmiles: row.drugSmiles,
    foodSmiles: row.foodSmiles,
    clinicalText: row.clinicalText,
    result: {
      severity_score: row.result_severity_score,
      severity_label: row.result_severity_label,
      confidence: row.result_confidence,
      raw_probabilities: JSON.parse(row.result_probabilities),
    },
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

/**
 * Delete check history
 */
export function deleteCheckHistory(id: string, userId: string): boolean {
  const database = getDatabase();

  const stmt = database.prepare(`
    DELETE FROM check_history WHERE id = ? AND userId = ?
  `);

  const result = stmt.run(id, userId);
  return result.changes > 0;
}

/**
 * Clear all user history
 */
export function clearUserHistory(userId: string): number {
  const database = getDatabase();

  const stmt = database.prepare(`
    DELETE FROM check_history WHERE userId = ?
  `);

  const result = stmt.run(userId);
  return result.changes;
}

/**
 * Close database connection
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
