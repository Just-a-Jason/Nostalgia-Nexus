import { createDir, exists, writeTextFile } from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import { APPS_URL, BASE_IMAGE_URL } from "../constants";
import LocalStorage from "./LocalStorage";
import { invoke } from "@tauri-apps/api";
import { App } from "../Interfaces/App";
import axios from "axios";

export default class CacheService {
  constructor(
    private cacheIconsDir: string = "",
    public cachingFileName: string = "",
    public totalItems: number = 0,
    public currentItem: number = 0
  ) {}

  public async useCache(): Promise<App[]> {
    const CACHE_DIR = (await appDataDir()) + "\\cache";
    this.cacheIconsDir = CACHE_DIR + "\\icons";
    const CACHE_JSON = CACHE_DIR + "\\cache.json";

    const cacheAllowed = LocalStorage.tryGet(true, "allow-cache");

    if (cacheAllowed) await this.createCacheDir();

    const webData = (await axios.get(APPS_URL, { responseType: "json" }))
      .data as App[];

    // Cache disabled
    if (!cacheAllowed) return webData;
    else if (cacheAllowed && !(await exists(CACHE_JSON))) {
      await writeTextFile(CACHE_JSON, JSON.stringify(webData));

      this.totalItems = webData.length;

      // Cache can't be compared to webData. Program must save all data from web.
      for (const app of webData) {
        const IMAGE_URL = `${BASE_IMAGE_URL}${app.iconUrl}?raw=true`;

        const savePath = `${this.cacheIconsDir}\\${app.iconUrl}`;
        this.cachingFileName = app.iconUrl;

        await invoke("download_file", { url: IMAGE_URL, dest: savePath });
        this.currentItem++;
      }

      return webData;
    }

    return [];
  }

  private async createCacheDir() {
    if (await exists(this.cacheIconsDir)) return;
    await createDir(this.cacheIconsDir, { recursive: true });
  }

  private async loadLocalResource(path: string) {}

  private compare(a: App, b: App): boolean {
    return (
      a.description === b.description &&
      a.iconUrl === b.iconUrl &&
      a.name === b.name &&
      a.releseDate === b.releseDate &&
      a.download.fileSize === b.download.fileSize &&
      a.download.version === b.download.version &&
      a.download.fileID === b.download.fileID
    );
  }
}
