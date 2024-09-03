import { exists, readTextFile } from "@tauri-apps/api/fs";
import { DATABASE_TABLES, fileSizeToBytes } from "../constants";
import Database from "tauri-plugin-sql-api";
import App from "../Interfaces/App";
import LocalStorage from "./LocalStorage";
import { invoke } from "@tauri-apps/api";

interface SaveAppOptions {
  shortCutPath: string | null;
  basePath: string;
  app: App;
}

export const initDataBase = async () => {
  const db = await loadDataBase();

  const tables = DATABASE_TABLES.map(async (table) => {
    await db.execute(table);
  });

  await Promise.all(tables);
  await clearUninstalledGames();
  await db.close();
};

export const getAllIds = async () => {
  const db = await loadDataBase();

  const res: string[] = (
    (await db.select("SELECT fileID FROM app;")) as string[]
  ).map((obj: any) => obj.fileID);

  await db.close();

  return res as string[];
};

export const removeAppFromDataBase = async (fileID: string) => {
  const db = await loadDataBase();

  const shortCutPath: string | null = (
    (await db.select("SELECT shortCutPath FROM app WHERE fileID = ?;", [
      fileID,
    ])) as Record<string, string>[]
  )[0]["shortCutPath"];

  // Remove shortcut from desktop if it exists
  if (shortCutPath !== null) {
    if (await exists(shortCutPath)) {
      await invoke("remove_file", { path: shortCutPath });
    }
  }

  await db.execute("DELETE FROM app WHERE fileID = ?;", [fileID]);

  await db.close();
};

const loadDataBase = async () => {
  const db = await Database.load("sqlite:library.db");

  return db;
};

export const addGameToLibrary = async ({
  app,
  basePath,
  shortCutPath = null,
}: SaveAppOptions) => {
  const FULL_GAME_CODE = basePath + "//code.txt";

  if ((await inLibrary(app.download.fileID)).exists) return;

  const db = await loadDataBase();

  await db.execute(
    "INSERT INTO app(fileID, name, fileSize, savePath, iconUrl) VALUES(?,?,?,?,?);",
    [
      app.download.fileID,
      app.name,
      fileSizeToBytes(app.download.fileSize),
      basePath,
      app.iconUrl,
    ]
  );

  if (LocalStorage.tryGet(true, "create-shortcut")) {
    await db.execute("UPDATE app SET shortCutPath = ?;", [shortCutPath]);
  }

  await db.execute("INSERT INTO meta_data(fileID) VALUES (?);", [
    app.download.fileID,
  ]);

  if (await exists(FULL_GAME_CODE)) {
    const code = await readTextFile(FULL_GAME_CODE);
    await db.execute("UPDATE app SET fullGameCode = ? WHERE fileID = ?;", [
      code,
      app.download.fileID,
    ]);
  }

  await db.close();
};

export const inLibrary = async (fileID: string) => {
  const db = await loadDataBase();

  const appData: Record<string, any> = await db.select(
    "SELECT savePath FROM app WHERE fileID = ?;",
    [fileID]
  );

  const exists = appData.length !== 0;

  await db.close();

  return { exists: exists, savePath: exists ? appData[0]["savePath"] : "" };
};

const clearUninstalledGames = async () => {
  const db = await loadDataBase();

  const games: any[] = await db.select("SELECT fileID, savePath FROM app;");

  for (const game of games) {
    if (!(await exists(game.savePath))) {
      await db.execute("DELETE FROM app WHERE fileID = ?;", [game.fileID]);
    }
  }

  await db.close();
};

export const totalInstalledSize = async () => {
  const db = await loadDataBase();

  const sizes = await db.select("SELECT SUM(fileSize) as totalSize FROM app;");

  await db.close();
  return sizes;
};

export default loadDataBase;
