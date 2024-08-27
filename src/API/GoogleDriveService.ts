import {
  BinaryFileContents,
  writeBinaryFile,
  exists,
} from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import { getClient, ResponseType } from "@tauri-apps/api/http";
import { createDir } from "@tauri-apps/api/fs";
import { VIRUS_WARNING_REGEX } from "../constants";

interface DownloadOptions {
  onProgressCallback: (progress: { loaded: number; total: number }) => void;
  fileName: string;
}

export default class GoogleDriveService {
  constructor(private savePath: string) {}
  public async downloadFile(
    fileId: string,
    options: DownloadOptions
  ): Promise<void> {
    const DOWNLOAD_DRIVE_URL = `https://drive.google.com/uc?id=${fileId}&export=download`;
    this.savePath = `${await appDataDir()}apps\\${options.fileName}`;
    const BASE_PATH = (await appDataDir()) + "apps";

    await this.createAppsFolder(BASE_PATH);
    if (await exists(this.savePath)) return;

    await this.downloadAppFiles(DOWNLOAD_DRIVE_URL);
  }

  private async downloadAppFiles(downloadURL: string) {
    try {
      const client = await getClient();
      const response = await client.get(downloadURL, {
        responseType: ResponseType.Binary,
      });
      const data = response.data;

      const dataString = new TextDecoder("utf-8").decode(
        new Uint8Array(data as any).buffer
      );

      if (this.isAntiVirusScreen(dataString)) {
        await this.bypassAntivirusScreen(dataString);
        return;
      }
    } catch (error) {
      console.warn(error);
    }
  }

  private isAntiVirusScreen(data: string): boolean {
    return VIRUS_WARNING_REGEX.test(data);
  }

  private async createAppsFolder(path: string) {
    if (!(await exists(path))) {
      console.info(`Folder does not exist, creating... ${path}`);
      await createDir(path, { recursive: true });
    }
  }

  private async bypassAntivirusScreen(htmlPage: string) {
    const idRegex = /name="id" value="([^"]+)"/;
    const confirmRegex = /name="confirm" value="([^"]+)"/;
    const uuidRegex = /name="uuid" value="([^"]+)"/;

    const id = idRegex.exec(htmlPage)?.[1];
    const confirm = confirmRegex.exec(htmlPage)?.[1];
    const uuid = uuidRegex.exec(htmlPage)?.[1];

    if (id && confirm && uuid) {
      const downloadUrl = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=${confirm}&uuid=${uuid}`;

      this.downloadZip(downloadUrl);
    }
  }

  private async downloadZip(downloadURL: string) {
    console.log(`Starting downloading zip files from: ${downloadURL}`);
  }
}
