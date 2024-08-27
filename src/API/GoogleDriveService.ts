import {
  BinaryFileContents,
  writeBinaryFile,
  exists,
} from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import { getClient, ResponseType } from "@tauri-apps/api/http";
import { createDir } from "@tauri-apps/api/fs";

interface DownloadOptions {
  onProgressCallback: (progress: { loaded: number; total: number }) => void;
  fileName: string;
}

export default class GoogleDriveService {
  public async downloadFile(
    fileId: string,
    options: DownloadOptions
  ): Promise<void> {
    const DOWNLOAD_URL = `https://drive.google.com/uc?id=${fileId}&export=download`;
    const BASE_PATH = (await appDataDir()) + "apps";

    console.log(DOWNLOAD_URL);

    if (!(await exists(BASE_PATH))) {
      console.info(`Folder does not exist, creating... ${BASE_PATH}`);
      await createDir(BASE_PATH, { recursive: true });
    } else {
      console.info("Folder already exists");
    }

    const SAVE_PATH = `${await appDataDir()}apps\\${options.fileName}`;

    console.log(SAVE_PATH);

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

      console.info(`File downloaded successfully to ${SAVE_PATH}`);
    } catch (error) {
      console.warn(
        `Something went wrong while accessing: ${DOWNLOAD_URL}`,
        error
      );
    }
  }
}
