import {
  createDir,
  exists,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import { APPS_URL, BASE_IMAGE_URL } from "../constants";
import LocalStorage from "./LocalStorage";
import { invoke } from "@tauri-apps/api";
import { App } from "../Interfaces/App";
import axios from "axios";
import { convertFileSrc } from "@tauri-apps/api/tauri";

interface CacheServiceOptions {
  onProgress?: (payload?: CacheServicePayload) => void;
  onFinish?: () => void;
}

export interface CacheServicePayload {
  remainingAssets: number;
  currentItem: number;
  totalItems: number;
  fileName: string;
}

export default class CacheService {
  constructor(
    private options?: CacheServiceOptions,
    private cacheIconsDir: string = "",
    private cacheJSONFile: string = ""
  ) {}

  private async setUpPaths() {
    const CACHE_DIR = (await appDataDir()) + "\\cache";
    this.cacheIconsDir = CACHE_DIR + "\\icons";
    this.cacheJSONFile = CACHE_DIR + "\\cache.json";
  }
  public async writeCache() {
    await this.setUpPaths();

    const cacheAllowed = LocalStorage.tryGet(true, "allow-cache");
    if (cacheAllowed) await this.createCacheDir();

    const webData = (await axios.get(APPS_URL, { responseType: "json" }))
      .data as App[];
    // Cache disabled
    if (!cacheAllowed) {
      this.options?.onFinish?.();
      return;
    } else if (cacheAllowed) {
      const fileExists = await exists(this.cacheJSONFile);

      if (fileExists) {
        const localData = JSON.parse(await readTextFile(this.cacheJSONFile));
        const [diff, indexes] = this.difference(localData, webData);

        // Update local version of the file
        let cacheIndex = 0;
        if (diff.length > 0) {
          for (const i of indexes) {
            const urlA = `${this.cacheIconsDir}${webData[i].iconUrl}`;
            const urlB = `${this.cacheIconsDir}${diff[cacheIndex++].iconUrl}`;

            if (urlA !== urlB) {
              // Remove the old file from cache if exists
              if (await exists(urlB)) {
                await invoke("remove_file", { path: urlB });
              }
            }
          }

          await this.cacheFilesToHardDrive(diff);

          await writeTextFile(this.cacheJSONFile, JSON.stringify(webData));
          window.location.reload();
        }

        this.options?.onFinish?.();
      } else {
        await this.cacheFilesToHardDrive(webData, true);
        await writeTextFile(this.cacheJSONFile, JSON.stringify(webData));
        this.options?.onFinish?.();
      }
    }
  }

  private async cacheFilesToHardDrive(
    apps: App[],
    skipExisting: boolean = false
  ) {
    const downloadPromises = apps.map(async (app, index) => {
      const IMAGE_URL = `${BASE_IMAGE_URL}${app.iconUrl}?raw=true`;
      const savePath = `${this.cacheIconsDir}\\${app.iconUrl}`;
      const skip = skipExisting && (await exists(savePath));

      this.options?.onProgress?.({
        remainingAssets: apps.length - index,
        currentItem: index + 1,
        fileName: app.iconUrl,
        totalItems: apps.length,
      });

      if (!skip) {
        await invoke("download_file", { url: IMAGE_URL, dest: savePath });
      }
    });

    await Promise.all(downloadPromises);
  }

  async useCache(): Promise<App[]> {
    await this.setUpPaths();

    let apps: App[];

    if (
      (await this.cacheFileExists()) &&
      LocalStorage.tryGet(true, "allow-cache")
    ) {
      try {
        const localData: App[] = JSON.parse(
          await readTextFile(this.cacheJSONFile)
        );

        for (const app of localData) {
          const SRC = `${this.cacheIconsDir}\\${app.iconUrl}`;
          app.iconUrl = this.loadLocalResource(SRC);
        }

        apps = localData;
      } catch {
        apps = await this.fetchApps();
      }
    } else {
      apps = await this.fetchApps();
    }

    return apps;
  }

  async fetchApps(): Promise<App[]> {
    const apps: App[] = (await axios.get(APPS_URL, { responseType: "json" }))
      .data;

    // Convert iconUrl to the BASE_IMAGE_URL format
    for (const app of apps) {
      app.iconUrl = `${BASE_IMAGE_URL}${app.iconUrl}?raw=true`;
    }

    return apps;
  }

  private async cacheFileExists(): Promise<boolean> {
    return await exists(this.cacheJSONFile);
  }

  private difference(a: App[], b: App[]): [App[], number[]] {
    const diff: App[] = [];
    const indexes = [];

    // Compare elements that exist in both arrays
    for (let i = 0; i < a.length; i++) {
      if (!this.compare(a[i], b[i])) {
        diff.push(b[i]);
        indexes.push(i);
      }
    }

    for (let i = a.length; i < b.length; i++) {
      diff.push(b[i]);
      indexes.push(i);
    }

    return [diff, indexes];
  }

  private async createCacheDir() {
    if (await exists(this.cacheIconsDir)) return;
    await createDir(this.cacheIconsDir, { recursive: true });
  }

  private loadLocalResource(path: string) {
    return convertFileSrc(path);
  }

  private compare(a: App, b: App): boolean {
    return (
      a.description === b.description &&
      a.iconUrl === b.iconUrl &&
      a.name === b.name &&
      a.releseDate === b.releseDate &&
      a.download.fileSize === b.download.fileSize &&
      a.download.version === b.download.version &&
      a.download.fileID === b.download.fileID &&
      a.category === b.category
    );
  }
}
