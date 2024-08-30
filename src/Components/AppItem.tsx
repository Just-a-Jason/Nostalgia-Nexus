import { BASE_IMAGE_URL } from "../constants";
import { useEffect, useState } from "react";
import { App } from "../Interfaces/App";
import LazyImage from "./LazyImage";
import "./AppItem.tsx.scss";
import SvgIcon from "./SvgIcon";

interface Props {
  showDownloadScreen: (app: App) => void;
  showIfInLib: boolean;
  appIds: string[];
  app: App;
}

const cutContent = (text: string, maxChars: number) =>
  (text.length > maxChars && text.substring(0, maxChars) + "...") || text;

const AppItem = ({ app, showDownloadScreen, appIds, showIfInLib }: Props) => {
  const [inLib, setInLib] = useState(false);

  if (app) app.setInLib = (inLib: boolean) => setInLib(inLib);

  const showScreen = () => {
    if (!app) return;
    showDownloadScreen(app);
  };

  useEffect(() => {
    if (!app) return;
    setInLib(appIds.includes(app.download.fileID));
  }, []);

  return (
    (!showIfInLib && inLib && <></>) || (
      <div className="app-item" onClick={showScreen}>
        <h3>{cutContent(app.name, 25)}</h3>

        <LazyImage
          src={`${BASE_IMAGE_URL}${app.iconUrl}?raw=true`}
          alt={app.name}
        />

        <p>{cutContent(app.description, 150)}</p>
        <p className="file-size">{app.download.fileSize}</p>
        <p className="relese-date">{app.releseDate}</p>

        {inLib && (
          <div className="in-library">
            <h2>In library</h2>
            <SvgIcon src="icons/in library.svg" alt="in library icon" />
          </div>
        )}
      </div>
    )
  );
};

export default AppItem;
