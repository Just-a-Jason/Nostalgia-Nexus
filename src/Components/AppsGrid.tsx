import AnimatedBackground from "./AnimatedBackGround";
import { useEffect, useState } from "react";
import axios from "axios";
import { APPS_URL } from "../constants";
import { App } from "../Interfaces/App";
import AppItem from "./AppItem";
import "./AppsGrid.tsx.scss";

interface Props {
  showDownloadScreen: (app: App) => void;
}

const AppsGrid = ({ showDownloadScreen }: Props) => {
  const [apps, setApps] = useState<App[]>([]);

  const fetchApps = async () => {
    try {
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
      {apps.length === 0 ? (
        <h1>Loading apps...</h1>
      ) : (
        apps.map((app, index) => (
          <AppItem
            app={app}
            key={index}
            showDownloadScreen={showDownloadScreen}
          />
        ))
      )}
    </section>
  );
};

export default AppsGrid;
