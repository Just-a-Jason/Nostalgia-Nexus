import { notification } from "@tauri-apps/api";
import LocalStorage from "./API/LocalStorage";

export const APPS_URL =
  "https://raw.githubusercontent.com/Just-a-Jason/Nostalgia-Nexus/main/apps.json";

export const BASE_IMAGE_URL =
  "https://github.com/Just-a-Jason/Nostalgia-Nexus/blob/main/App Icons/";

export const VIRUS_WARNING_REGEX =
  /<form[^>]*action="https:\/\/drive\.usercontent\.google\.com\/download"[^>]*>/;

const fileEndings = ["B", "KB", "MB", "GB", "TB"];

export const bytesToFileSize = (
  fileSize: number | undefined,
  decimals: number = 0
) => {
  if (fileSize === undefined) return;

  let fileEnding = 0;

  while (fileSize > 1024) {
    fileSize /= 1024;
    fileEnding++;
  }

  if (fileEnding > fileEndings.length) fileEnding = fileEndings.length - 1;

  return `${fileSize.toFixed(decimals)} ${fileEndings[fileEnding]}`;
};

export const fileSizeToBytes = (fileSize: string) => {
  const FILE_SIZE_POWER = 1024;
  const data = fileSize.trim().split(" ");
  const power = Math.pow(FILE_SIZE_POWER, fileEndings.indexOf(data[1]));

  return parseFloat(data[0]) * power;
};

export const showNotif = async (data: notification.Options) => {
  const allowedNotif = LocalStorage.tryGet(true, "notifications");

  if (!allowedNotif) return;

  if (!(await notification.isPermissionGranted())) return;
  await notification.sendNotification(data);
};

export const DATABASE_TABLES = [
  `CREATE TABLE IF NOT EXISTS app(
    fileID string NOT NULL,
    savePath string NOT NULL,
    fileSize long NOT NULL,
    name string NOT NULL,
    iconUrl string NOT NULL,
    fullGameCode string,
    shortCutPath string
  );`,

  `CREATE TABLE IF NOT EXISTS meta_data(
    fileID string NOT NULL,
    totalPlayTime INTIGER NOT NULL DEFAULT 0,
    lastPlayed string
  );`,
];
