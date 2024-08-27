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
          src={`icons/Apps/${app?.IconName}`}
          alt="app download icon"
          className="app-icon"
          draggable={false}
        />
        <div className="options">
          <p className="file-size">{app?.Versions[0].FileSize}</p>
          <h1>{app?.AppName}</h1>

          <p>{app?.Description}</p>
          <p className="relese-date">{app?.ReleseDate}</p>

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
