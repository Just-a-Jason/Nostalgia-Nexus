import { BASE_IMAGE_URL } from "../constants";
import { App } from "../Interfaces/App";
import "./AppItem.tsx.scss";
import LazyImage from "./LazyImage";

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
      <h3>{cutContent(app.name, 25)}</h3>

      <LazyImage
        src={`${BASE_IMAGE_URL}${app.iconUrl}?raw=true`}
        alt={app.name}
      />

      <p>{cutContent(app.description, 150)}</p>
      <p className="file-size">{app.download.fileSize}</p>
      <p className="relese-date">{app.releseDate}</p>

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
