import { App } from "../Interfaces/App";
import "./DownloadScreen.tsx.scss";

interface Props {
  hideDownloadScreen: () => void;
  app?: App;
}

const DownloadScreen = ({ app, hideDownloadScreen }: Props) => {
  return (
    <div className="download-screen">
      <div className="wrapper">
        <img
          src={`icons/Apps/${app?.iconUrl}`}
          alt="app download icon"
          className="app-icon"
          draggable={false}
        />
        <div className="options">
          <p className="file-size">{app?.download.fileSize}</p>
          <h1>{app?.name}</h1>

          <p>{app?.description}</p>
          <p className="relese-date">{app?.releseDate}</p>

          <div className="buttons">
            <button className="download-button" title="Install">
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
