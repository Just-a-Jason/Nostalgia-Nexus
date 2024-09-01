import CacheService, { CacheServicePayload } from "../API/CacheService";
import { DownloadPayload } from "../Interfaces/DownloadPayload";
import { listen } from "@tauri-apps/api/event";
import { bytesToFileSize } from "../constants";
import { useEffect, useState } from "react";
import "./CacheScreen.tsx.scss";
import SvgIcon from "./SvgIcon";
import LocalStorage from "../API/LocalStorage";

interface Props {
  setCacheScreen: (on: boolean) => void;
  setWelcomeScreen: (on: boolean) => void;
}

const CacheScreen = ({ setCacheScreen, setWelcomeScreen }: Props) => {
  const [cache, setCache] = useState<CacheServicePayload | undefined>(
    undefined
  );

  const [payload, setPayload] = useState<DownloadPayload | undefined>(
    undefined
  );

  const [cacheService, setCacheService] = useState<CacheService | null>(null);

  useEffect(() => {
    if (cacheService) return;

    listen("download-progress", (event) => {
      setPayload(event.payload as DownloadPayload);
    });

    const service = new CacheService({
      onFinish: () => {
        setCacheScreen(false);
        setWelcomeScreen(LocalStorage.tryGet(true, "welcome-screen"));
        service.useCache();
      },

      onProgress: (payload) => setCache(payload),
    });
    service.writeCache();

    setCacheService(service);
  });

  return (
    <div data-tauri-drag-region className="cache-screen">
      <header>
        <h1>Nostalgia Nexus</h1>
        <SvgIcon src="icons/icon.svg" alt="nostalgia nexus logo" />
      </header>
      <p>
        Nostalgia Nexus is cacheing assets to make your experience{" "}
        <span>
          EXTERMELY FAST! <SvgIcon src="icons/bolt.svg" alt="fast bolt icon" />
        </span>
      </p>
      <div className="status">
        <div className="progress-bar">
          <p>{payload?.progress.toFixed(1) || "0"} %</p>
          <div
            className="progress-bar-fill"
            style={{
              width: `${
                payload?.progress === 0 || !payload ? 2 : payload?.progress
              }%`,
            }}
          ></div>
        </div>
      </div>
      <p>Cacheing... {cache?.fileName}</p>
      <p>
        {cache?.currentItem || 0} / {cache?.totalItems || 0} [Remaining assets:{" "}
        {cache?.remainingAssets || 0}]
      </p>
      <p>
        {bytesToFileSize(payload?.downloaded) || "0 B"} /{" "}
        {bytesToFileSize(payload?.fileSize) || "0 B"}
      </p>
    </div>
  );
};

export default CacheScreen;
