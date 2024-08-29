import Database from "tauri-plugin-sql-api";
import { exists, readTextFile } from "@tauri-apps/api/fs";
import { App } from "../Interfaces/App";
import { fileSizeToBytes } from "../constants";

interface SaveAppOptions {
  basePath: string;
  app: App;
}

export const initDataBase = async () => {
  const db = await loadDataBase();

  await db.execute(`
      CREATE TABLE IF NOT EXISTS apps(
          name string NOT NULL,
          savePath string NOT NULL,
          fullGameCode string,
          fileID string NOT NULL,
          fileSize long NOT NULL,
          lastPlayed string,
          totalPlayTime INTEGER NOT NULL,
          iconUrl string NOT NULL );`);

  await clearUninstalledGames();
  await db.close();
};

const loadDataBase = async () => {
  const db = await Database.load("sqlite:library.db");

  return db;
};

export const addGameToLibrary = async ({ app, basePath }: SaveAppOptions) => {
  const FULL_GAME_CODE = basePath + "//code.txt";

  if ((await inLibrary(app.download.fileID)).exists) return;

  const db = await loadDataBase();

  await db.execute(
    "INSERT INTO apps(name, savePath, fileID, totalPlayTime, fileSize,iconUrl) VALUES(?,?,?,?,?,?);",
    [
      app.name,
      basePath,
      app.download.fileID,
      0,
      fileSizeToBytes(app.download.fileSize),
      app.iconUrl,
    ]
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

  await db.close();

  return { exists: exists, savePath: exists ? appData[0]["savePath"] : "" };
};

const clearUninstalledGames = async () => {
  const db = await loadDataBase();

  const games: any[] = await db.select("SELECT fileID, savePath FROM apps;");

  for (const game of games) {
    if (!(await exists(game.savePath))) {
      await db.execute("DELETE FROM apps WHERE fileID = ?;", [game.fileID]);
    }
  }

  await db.close();
};

export const totalInstalledSize = async () => {
  const db = await loadDataBase();

  const sizes = await db.select("SELECT SUM(fileSize) as totalSize FROM apps;");

  await db.close();
  return sizes;
};

export default loadDataBase;
