import { DownloadPayload } from "../Interfaces/DownloadPayload";
import DownloadProgressScreen from "./DownloadProgressScreen";
import { useEffect, useState } from "react";
import GoogleDriveService from "../API/GoogleDriveService";
import { BASE_IMAGE_URL } from "../constants";
import { inLibrary } from "../API/Database";
import { invoke } from "@tauri-apps/api";
import { App } from "../Interfaces/App";
import "./DownloadScreen.tsx.scss";
import LazyImage from "./LazyImage";
import SvgIcon from "./SvgIcon";

interface Props {
  hideDownloadScreen: () => void;
  app?: App;
}

const DownloadScreen = ({ app, hideDownloadScreen }: Props) => {
  const [payload, setPayload] = useState<undefined | DownloadPayload>(
    undefined
  );
  const [downloading, setDownloading] = useState(false);
  const [isInLibrary, setInLibrary] = useState(false);
  const [exePath, setExePath] = useState("");

  useEffect(() => {
    const inlib = async () => {
      if (app) {
        const res = await inLibrary(app?.download.fileID);
        setInLibrary(res.exists);

        if (res.exists) {
          setExePath(res.savePath);
        }
      }
    };

    inlib();
  }, []);

  const downloadFiles = async () => {
    if (downloading || !app) return;

    if (isInLibrary) {
      try {
        await invoke("run_game", { dirPath: exePath });
      } catch (error) {
        console.error("Failed to start game:", error);
      }
      return;
    }

    const driveService = new GoogleDriveService(app);

    setDownloading(true);

    await driveService.downloadFile(app.download.fileID, {
      downloadingFinished: (path) => {
        if (path) {
          setExePath(path);
          setDownloading(false);
          setInLibrary(true);
          return;
        }
      },
      onProgress: (payload) => setPayload(payload),
      fileName: app.name + ".zip",
      appName: app.name,
    });
  };

  return (
    <>
      {downloading && <DownloadProgressScreen payload={payload} />}

      <div className="download-screen" data-tauri-drag-region>
        <div className="wrapper">
          <div className="app-img">
            <LazyImage
              src={`${BASE_IMAGE_URL}${app?.iconUrl}?raw=true`}
              alt="app download icon"
            />
            {isInLibrary && (
              <div className="in-library">
                <h2>In library</h2>
                <SvgIcon src="icons/in library.svg" alt="checkmark" />
              </div>
            )}
          </div>

          <div className="options">
            <p className="file-size">{app?.download.fileSize}</p>
            <h1>{app?.name}</h1>

            <p>{app?.description}</p>
            <p className="relese-date">{app?.releseDate}</p>

            <div className="buttons">
              <button
                className="download-button"
                title={(!isInLibrary && "Install!") || "Run game! ▶️"}
                onClick={downloadFiles}
              >
                {(isInLibrary && "Run game") ||
                  (!downloading && "Install") ||
                  "Instaling..."}
                <SvgIcon
                  src={
                    (isInLibrary && "icons/run game.svg") ||
                    (!downloading && "icons/download.svg") ||
                    "icons/spinner.svg"
                  }
                  alt="green button icon"
                />
              </button>
              <button
                className={`cancel-button ${(downloading && "disabled") || ""}`}
                onClick={hideDownloadScreen}
                title="Cancel"
                disabled={downloading}
              >
                Cancel
                <img
                  src="icons/close.svg"
                  alt="download icon"
                  draggable={false}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadScreen;
