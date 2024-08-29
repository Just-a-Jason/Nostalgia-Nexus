export const APPS_URL =
  "https://raw.githubusercontent.com/Just-a-Jason/Nostalgia-Nexus/main/apps.json";

export const BASE_IMAGE_URL =
  "https://github.com/Just-a-Jason/Nostalgia-Nexus/blob/main/App Icons/";

export const VIRUS_WARNING_REGEX =
  /<form[^>]*action="https:\/\/drive\.usercontent\.google\.com\/download"[^>]*>/;

const fileEndings = ["B", "KB", "MB", "GB", "TB"];

export const bytesToFileSize = (fileSize: number | undefined) => {
  if (fileSize === undefined) return;

  let fileEnding = 0;

  while (fileSize > 1024) {
    fileSize /= 1024;
    fileEnding++;
  }

  if (fileEnding > fileEndings.length) fileEnding = fileEndings.length - 1;

  return `${fileSize.toFixed(0)} ${fileEndings[fileEnding]}`;
};

export const fileSizeToBytes = (fileSize: string) => {
  const FILE_SIZE_POWER = 1024;
  const data = fileSize.trim().split(" ");
  const power = Math.pow(FILE_SIZE_POWER, fileEndings.indexOf(data[1]));

  return parseFloat(data[0]) * power;
};
