import { DownloadPayload } from "../Interfaces/DownloadPayload";
import DownloadProgressScreen from "./DownloadProgressScreen";
import { useEffect, useState } from "react";
import GoogleDriveService from "../API/GoogleDriveService";
import { BASE_IMAGE_URL, showNotif } from "../constants";
import { inLibrary, removeAppFromDataBase } from "../API/Database";
import { App } from "../Interfaces/App";
import "./DownloadScreen.tsx.scss";
import LazyImage from "./LazyImage";
import SvgIcon from "./SvgIcon";
import { invoke } from "@tauri-apps/api";
import DownloadOption from "./DownloadOption";
import LocalStorage from "../API/LocalStorage";

interface Props {
  hideDownloadScreen: () => void;
  app?: App;
}

const DownloadScreen = ({ app, hideDownloadScreen }: Props) => {
  const [payload, setPayload] = useState<undefined | DownloadPayload>(
    undefined
  );

  const [isInLibrary, setInLibrary] = useState(false);

  const [runAfterDownload, setRunAfterDownload] = useState(
    LocalStorage.tryGet(false, "run-after-download")
  );

  const [createShortcut, setCreateShortcut] = useState(
    LocalStorage.tryGet(true, "create-shortcut")
  );

  const runAfterDownloadSetting = (on: boolean) => {
    setRunAfterDownload(on);
    LocalStorage.set("run-after-download", on);
  };

  const createShortCutSetting = (on: boolean) => {
    setCreateShortcut(on);
    LocalStorage.set("create-shortcut", on);
  };

  const [filesPath, setFilesPath] = useState("");
  const [busy, setBusy] = useState(false);

  const unInstallGame = async () => {
    try {
      setPayload({
        downloaded: 0,
        fileSize: 0,
        operation: "Uninstalling game files...",
        progress: 0,
        remainingTime: 0,
      });

      await invoke("remove_file", { path: filesPath });
      setBusy(true);

      if (app) await removeAppFromDataBase(app.download.fileID);

      await showNotif({
        title: "Nostalgia Nexus | App Uninstalled 🗑️",
        body: `${app?.name} uninstalled successfully! ✨💞`,
        icon: "icons/icons.png",
        sound: "Alarm2",
      });

      setInLibrary(false);
      app?.setInLib?.(false);
    } catch (error) {
      console.error(error);
      await showNotif({
        title: "Nostalgia Nexus | Something Went Wrong 🫠",
        body: `Somethink went wrong while uninstalling ${app?.name} 😵`,
        icon: "icons/icons.png",
        sound: "Default",
      });
    }
    setBusy(false);
  };

  useEffect(() => {
    const inlib = async () => {
      if (app) {
        const res = await inLibrary(app?.download.fileID);
        setInLibrary(res.exists);

        if (res.exists) {
          setFilesPath(res.savePath);
        }
      }
    };

    inlib();
  }, []);

  const downloadFiles = async () => {
    if (busy || !app) return;

    if (isInLibrary) {
      try {
        await invoke("run_game", { dirPath: filesPath });
      } catch (error) {
        console.error("Failed to start game:", error);
      }
      return;
    }

    const driveService = new GoogleDriveService(app);

    setBusy(true);

    await driveService.downloadFile(app.download.fileID, {
      downloadingFinished: (path) => {
        if (path) {
          setFilesPath(path);
          setBusy(false);
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
      {busy && <DownloadProgressScreen payload={payload} />}

      <div className="download-screen" data-tauri-drag-region>
        <div className="download-settings">
          <DownloadOption
            setIsOn={runAfterDownloadSetting}
            text="Run after download"
            isOn={runAfterDownload}
          />
          <DownloadOption
            text="Create desktop shortcut"
            setIsOn={createShortCutSetting}
            isOn={createShortcut}
          />
        </div>
        <div className="wrapper">
          <div className="app-img">
            <LazyImage
              src={`${BASE_IMAGE_URL}${app?.iconUrl}?raw=true`}
              alt="app download icon"
            />
            {isInLibrary && (
              <div className="in-library">
                <SvgIcon src="icons/in library.svg" alt="checkmark" />
              </div>
            )}
          </div>

          <div className="options">
            <div className="meta-data">
              <p className="file-size">{app?.download.fileSize} (Zipped)</p>
              <p className="relese-date">{app?.releseDate}</p>
            </div>

            <h1>{app?.name}</h1>

            <p className="description">{app?.description}</p>

            <div className="buttons">
              <button
                className="green-button"
                title={(!isInLibrary && "Install!") || "Run game! ▶️"}
                onClick={downloadFiles}
              >
                {(isInLibrary && "Run game") ||
                  (!busy && "Install") ||
                  "Instaling..."}
                <SvgIcon
                  src={
                    (isInLibrary && "icons/run game.svg") ||
                    (!busy && "icons/download.svg") ||
                    "icons/spinner.svg"
                  }
                  alt="green button icon"
                />
              </button>
              {isInLibrary && (
                <button
                  className={`red-button ${(busy && "disabled") || ""}`}
                  onClick={unInstallGame}
                  title="Uninstall 🗑️"
                  disabled={busy}
                >
                  Uninstall
                  <img
                    src="icons/uninstall.svg"
                    alt="uninstall icon"
                    draggable={false}
                  />
                </button>
              )}
              <button
                className={`orange-button ${(busy && "disabled") || ""}`}
                onClick={hideDownloadScreen}
                title="Close ❌"
                disabled={busy}
              >
                Close
                <img src="icons/close.svg" alt="close icon" draggable={false} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadScreen;
