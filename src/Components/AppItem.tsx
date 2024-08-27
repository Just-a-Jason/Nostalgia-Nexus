import { App } from "../Interfaces/App";
import "./AppItem.tsx.scss";

interface Props {
  showDownloadScreen: (app: App) => void;
  inLibrary: boolean;
  app: App;
}

const cutContent = (text: string, maxChars: number) =>
  (text.length > maxChars && text.substring(0, maxChars) + "...") || text;

const AppItem = ({ app, inLibrary = false, showDownloadScreen }: Props) => {
  return (
    <div className="app-item" onClick={() => showDownloadScreen(app)}>
      <h3>{cutContent(app.AppName, 25)}</h3>
      <img
        src={`icons/Apps/${app.IconName}`}
        alt={app.AppName}
        draggable="false"
      />

      <p>{cutContent(app.Description, 150)}</p>
      <p className="file-size">{app.Versions[0].FileSize}</p>
      <p className="relese-date">{app.ReleseDate}</p>

      {inLibrary && (
        <div className="in-library">
          <h2>In library</h2>
          <img src="icons/in library.svg" alt="in library icon" />
        </div>
      )}
    </div>
  );
};

export default AppItem;
