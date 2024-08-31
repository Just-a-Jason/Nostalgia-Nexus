import AnimatedBackground from "./AnimatedBackGround";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import LocalStorage from "../API/LocalStorage";
import DownloadScreen from "./DownloadScreen";
import WelcomeScreen from "./WelcomeScreen";
import Settings from "./Routes/Settings";
import { App } from "../Interfaces/App";
import AppsGrid from "./AppsGrid";
import { useEffect, useState } from "react";
import "./AppLayout.tsx.scss";
import Footer from "./Footer";
import NavBar from "./NavBar";
import CacheScreen from "./CacheScreen";
import CacheService from "../API/CacheService";

const AppLayout = () => {
  const [appData, setAppData] = useState<App | undefined>(undefined);

  const [animated, setAnimated] = useState(
    LocalStorage.tryGet(true, "animated-background")
  );

  const [downloadScreen, setDownloadScreen] = useState(false);

  const [welcomeScreen, setWelcomeScreen] = useState(false);

  const [cacheScreen, setCacheScreen] = useState(false);

  const [showInstalledApps, setInstalledApps] = useState(
    LocalStorage.tryGet(true, "show-apps-in-lib")
  );

  const [cacheService, setCacheService] = useState<CacheService | null>(null);

  const showDownloadScreen = (app: App) => {
    setDownloadScreen(true);
    setAppData(app);
  };

  const fetchCache = async () => {
    if (LocalStorage.tryGet(true, "allow-cache")) {
      setCacheScreen(true);

      const service = new CacheService();
      setCacheService(service);

      await service.useCache();
    }

    setWelcomeScreen(LocalStorage.tryGet(true, "welcome-screen"));
    setCacheScreen(false);
  };

  useEffect(() => {
    fetchCache();
  }, []);

  return (
    <Router>
      <section className="app-layout">
        <NavBar />

        <div className="app-router">
          {animated && <AnimatedBackground />}
          <Routes>
            <Route
              path="/"
              element={
                <AppsGrid
                  showDownloadScreen={showDownloadScreen}
                  showAppsInGrid={showInstalledApps}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <Settings
                  setAnimatedBackGround={setAnimated}
                  showInstalledApps={setInstalledApps}
                  hideStats={false}
                />
              }
            />
          </Routes>
        </div>

        {cacheScreen && <CacheScreen cacheService={cacheService} />}

        {welcomeScreen && (
          <WelcomeScreen
            showInstalledApps={setInstalledApps}
            showAnimatedBackground={setAnimated}
            hideWelcomeScreen={() => {
              LocalStorage.set("welcome-screen", false);
              setWelcomeScreen(false);
            }}
          />
        )}

        {downloadScreen && (
          <DownloadScreen
            hideDownloadScreen={() => setDownloadScreen(false)}
            app={appData}
          />
        )}

        <Footer />
      </section>
    </Router>
  );
};

export default AppLayout;
