import AnimatedBackground from "./AnimatedBackGround";
import { useEffect, useState } from "react";
import axios from "axios";
import { APPS_URL } from "../constants";
import AppItem from "./AppItem";
import "./AppsGrid.tsx.scss";

const AppsGrid = () => {
  const [apps, setApps] = useState<Array<any>>([]);
  const fetchApps = async () => {
    try {
      const response = await axios.get(APPS_URL, { responseType: "json" });

      if (response.status === 200) setApps(response.data);
    } catch {
      console.warn("Can't fetch the url: " + APPS_URL);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return (
    <section className="apps-grid">
      <AnimatedBackground />
      {(apps.length === 0 && <h1>Loading apps...</h1>) ||
        apps.map((app, index) => (
          <AppItem app={app} key={index} inLibrary={false} />
        ))}
    </section>
  );
};

export default AppsGrid;
