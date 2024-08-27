import DownloadScreen from "./DownloadScreen";
import { App } from "../Interfaces/App";
import AppsGrid from "./AppsGrid";
import { useState } from "react";
import "./AppLayout.tsx.scss";
import Footer from "./Footer";
import NavBar from "./NavBar";

const AppLayout = () => {
  const [downloadScreen, setDownloadScreen] = useState(false);
  const [appData, setAppData] = useState<App | undefined>(undefined);

  const showDownloadScreen = (app: App) => {
    setDownloadScreen(true);
    setAppData(app);
  };

  const hideDownloadScreen = () => setDownloadScreen(false);

  return (
    <section className="app-layout">
      <NavBar />
      <AppsGrid showDownloadScreen={showDownloadScreen} />
      {downloadScreen && (
        <DownloadScreen app={appData} hideDownloadScreen={hideDownloadScreen} />
      )}
      <Footer />
    </section>
  );
};

export default AppLayout;
