import { DownloadPayload } from "../Interfaces/DownloadPayload";
import { listen } from "@tauri-apps/api/event";
import { bytesToFileSize } from "../constants";
import CacheService from "../API/CacheService";
import { useEffect, useState } from "react";
import "./CacheScreen.tsx.scss";
import SvgIcon from "./SvgIcon";

interface Props {
  cacheService: CacheService | null;
}

const CacheScreen = ({ cacheService }: Props) => {
  const [payload, setPayload] = useState<DownloadPayload | undefined>(
    undefined
  );

  useEffect(() => {
    listen("download-progress", (event) => {
      setPayload(event.payload as DownloadPayload);
    });
  });

  return (
    <div data-tauri-drag-region className="cache-screen">
      <header>
        <h1>Nostalgia Nexus!</h1>
        <SvgIcon src="icons/icon.svg" alt="nostalgia nexus logo" />
      </header>
      <p>
        App is cacheing assets to make your experience{" "}
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
      <p>Cacheing... {cacheService?.cachingFileName || ""}</p>
      <p>
        Remaining assets: {cacheService?.currentItem || "0"} /{" "}
        {cacheService?.totalItems || "0"}
      </p>
      <p>
        {bytesToFileSize(payload?.downloaded) || "0 B"} /{" "}
        {bytesToFileSize(payload?.fileSize) || "0 B"}
      </p>
    </div>
  );
};

export default CacheScreen;
