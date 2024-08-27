import GoogleDriveService from "../API/GoogleDriveService";
import { BASE_IMAGE_URL } from "../constants";
import { App } from "../Interfaces/App";
import "./DownloadScreen.tsx.scss";
import LazyImage from "./LazyImage";

interface Props {
  hideDownloadScreen: () => void;
  app?: App;
}

const DownloadScreen = ({ app, hideDownloadScreen }: Props) => {
  let downloading = false;

  const downloadFiles = () => {
    if (downloading || !app) return;

    const service = new GoogleDriveService();

    service.downloadFile(app.download.fileID, {
      fileName: app.name + ".zip",
      onProgressCallback: () => {},
    });

    downloading = true;
  };

  return (
    <div className="download-screen">
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
              title="Install"
              onClick={downloadFiles}
            >
              Install
              <img
                src="icons/download.svg"
                alt="download icon"
                draggable={false}
              />
            </button>
            <button
              className="cancel-button"
              onClick={hideDownloadScreen}
              title="Cancel"
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
  );
};

export default DownloadScreen;
