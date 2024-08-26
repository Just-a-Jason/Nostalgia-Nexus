import {
  BinaryFileContents,
  writeBinaryFile,
  exists,
} from "@tauri-apps/api/fs";
import { getClient, ResponseType } from "@tauri-apps/api/http";

interface DownloadOptions {
  onProgressCallback: (progress: { loaded: number; total: number }) => void;
  fileName: string;
  savePath: string;
}

export default class GoogleDriveService {
  public async downloadFile(
    fileId: string,
    options: DownloadOptions
  ): Promise<void> {
    const DOWNLOAD_URL = `https://drive.google.com/uc?id=${fileId}&export=download`;
    const SAVE_PATH = `${options.savePath}${options.fileName}`;

    if (await exists(SAVE_PATH)) return;

    try {
      const client = await getClient();
      const response = await client.get(DOWNLOAD_URL, {
        responseType: ResponseType.Binary,
      });
      const data = response.data;

      await writeBinaryFile(SAVE_PATH, data as BinaryFileContents);

      if (options.onProgressCallback) {
        options.onProgressCallback({
          loaded: (data as Uint8Array).length,
          total: (data as Uint8Array).length,
        });
      }

      console.log(`File downloaded successfully to ${options.savePath}`);
    } catch (error) {
      console.warn(
        `Something went wrong while accessing: ${DOWNLOAD_URL}`,
        error
      );
    }
  }
}
