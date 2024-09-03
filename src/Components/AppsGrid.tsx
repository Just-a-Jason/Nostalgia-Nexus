import { useEffect, useState } from "react";
import { getAllIds } from "../API/Database";
import CacheService from "../API/CacheService";
import App from "../Interfaces/App";
import "./AppsGrid.tsx.scss";
import CategoryGroup from "./CategoryGroup";
import { CATEGORIES } from "../constants";

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
      const service = new CacheService();
      setApps(await service.useCache());
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return (
    <section className="apps-grid">
      {CATEGORIES.map((category, index) => (
        <CategoryGroup
          showDownloadScreen={showDownloadScreen}
          showIfInLib={showAppsInGrid}
          appIds={libraryIds}
          category={category}
          apps={apps}
          key={index}
        />
      ))}
      {/* {apps.map((app, index) => (
        <AppItem
          showDownloadScreen={showDownloadScreen}
          showIfInLib={showAppsInGrid}
          appIds={libraryIds}
          key={index}
          app={app}
        />
      ))} */}
    </section>
  );
};

export default AppsGrid;
