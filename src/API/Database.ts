import Database from "tauri-plugin-sql-api";
import { exists, readTextFile } from "@tauri-apps/api/fs";
import { App } from "../Interfaces/App";

interface SaveAppOptions {
  basePath: string;
  app: App;
}

const loadDataBase = async () => {
  const db = await Database.load("sqlite:library.db");

  await db.execute(`
      CREATE TABLE IF NOT EXISTS apps(
          name string NOT NULL,
          savePath string NOT NULL,
          fullGameCode string,
          fileID string NOT NULL,
          lastPlayed string,
          totalPlayTime INTEGER NOT NULL
      )`);

  return db;
};

export const addGameToLibrary = async ({ app, basePath }: SaveAppOptions) => {
  const db = await loadDataBase();

  const FULL_GAME_CODE = basePath + "//code.txt";

  if ((await inLibrary(app.download.fileID)).exists) {
    await db.close();
    return;
  }

  await db.execute(
    "INSERT INTO apps(name, savePath, fileID, totalPlayTime) VALUES(?,?,?,?);",
    [app.name, basePath, app.download.fileID, 0]
  );

  if (await exists(FULL_GAME_CODE)) {
    const code = await readTextFile(FULL_GAME_CODE);
    await db.execute("UPDATE apps SET fullGameCode = ? WHERE fileID = ?;", [
      code,
      app.download.fileID,
    ]);
  }

  await db.close();
};

export const inLibrary = async (fileID: string) => {
  const db = await loadDataBase();

  const appData: Record<string, any> = await db.select(
    "SELECT savePath FROM apps WHERE fileID = ?;",
    [fileID]
  );

  const exists = appData.length !== 0;

  return { exists: exists, savePath: exists ? appData[0]["savePath"] : "" };
};

export const clearUninstalledGames = async () => {
  const db = await loadDataBase();

  const games: any[] = await db.select("SELECT fileID, savePath FROM apps;");

  for (const game of games) {
    if (!(await exists(game.savePath))) {
      await db.execute("DELETE FROM apps WHERE fileID = ?;", [game.fileID]);
    }
  }

  await db.close();
};

export default loadDataBase;
