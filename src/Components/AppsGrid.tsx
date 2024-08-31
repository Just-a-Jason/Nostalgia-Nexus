import { useEffect, useState } from "react";
import { getAllIds } from "../API/Database";
import { APPS_URL } from "../constants";
import { App } from "../Interfaces/App";
import AppItem from "./AppItem";
import "./AppsGrid.tsx.scss";
import axios from "axios";

interface Props {
  showDownloadScreen: (app: App) => void;
  showAppsInGrid: boolean;
}

const AppsGrid = ({ showDownloadScreen, showAppsInGrid }: Props) => {
  const [libraryIds, setLibraryIds] = useState<string[]>([]);
  const [apps, setApps] = useState<App[]>([]);

  const fetchApps = async () => {
    try {
      setLibraryIds(await getAllIds());
      const response = await axios.get(APPS_URL, { responseType: "json" });
      if (response.status === 200) {
        setApps(response.data);
      }
    } catch {
      console.warn("Can't fetch the url: " + APPS_URL);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return (
    <section className="apps-grid">
      {apps.map((app, index) => (
        <AppItem
          showDownloadScreen={showDownloadScreen}
          showIfInLib={showAppsInGrid}
          appIds={libraryIds}
          key={index}
          app={app}
        />
      ))}
    </section>
  );
};

export default AppsGrid;
