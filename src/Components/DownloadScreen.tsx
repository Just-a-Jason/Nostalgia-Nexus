import { useState } from "react";
import GoogleDriveService from "../API/GoogleDriveService";
import { BASE_IMAGE_URL } from "../constants";
import { App } from "../Interfaces/App";
import "./DownloadScreen.tsx.scss";
import LazyImage from "./LazyImage";
import DownloadProgressScreen from "./DownloadProgressScreen";
import { DownloadPayload } from "../Interfaces/DownloadPayload";

interface Props {
  hideDownloadScreen: () => void;
  app?: App;
}

const DownloadScreen = ({ app, hideDownloadScreen }: Props) => {
  const [payload, setPayload] = useState<undefined | DownloadPayload>(
    undefined
  );

  const [downloading, setDownloading] = useState(false);

  const downloadFiles = async () => {
    if (downloading || !app) return;

    const service = new GoogleDriveService(app);

    setDownloading(true);

    await service.downloadFile(app.download.fileID, {
      downloadingFinished: () => setDownloading(false),
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
          <LazyImage
            src={`${BASE_IMAGE_URL}${app?.iconUrl}?raw=true`}
            alt="app download icon"
          />

          <div className="options">
            <p className="file-size">{app?.download.fileSize}</p>
            <h1>{app?.name}</h1>

            <p>{app?.description}</p>
            <p className="relese-date">{app?.releseDate}</p>

            <div className="buttons">
              <button
                className="download-button"
                title="Install!"
                onClick={downloadFiles}
              >
                {(!downloading && "Install") || "Instaling..."}
                {(!downloading && (
                  <img
                    src="icons/download.svg"
                    alt="download icon"
                    draggable={false}
                  />
                )) || (
                  <img
                    src="icons/spinner.svg"
                    alt="download icon"
                    draggable={false}
                  />
                )}
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
