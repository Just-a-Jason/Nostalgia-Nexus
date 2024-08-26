import "./AppItem.tsx.scss";

interface App {
  Description: string;
  IconName: string;
  AppName: string;
  Versions: Version[];
  ReleseDate: string;
}

interface Version {
  AppVersion: string;
  FileSize: string;
  FileID: string;
}

interface Props {
  inLibrary: boolean;
  app: App;
}

const cutContent = (text: string, maxChars: number) =>
  (text.length > maxChars && text.substring(0, maxChars) + "...") || text;

const AppItem = ({ app, inLibrary = false }: Props) => {
  return (
    <div className="app-item">
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
