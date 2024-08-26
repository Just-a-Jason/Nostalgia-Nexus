import Database from "tauri-plugin-sql-api";

async function setupDatabase() {
  const db = await Database.load("sqlite:library.db");

  await db.execute(`
      CREATE TABLE IF NOT EXISTS apps(
          name string NOT NULL,
          exe_path string NOT NULL,
          full_game_code string,
          last_played string,
          total_play_time INTEGER NOT NULL
      )`);

  return db;
}

export default setupDatabase;
