import { HashRouter as Router, Route, Routes } from "react-router-dom";
import AnimatedBackground from "./AnimatedBackGround";
import LocalStorage from "../API/LocalStorage";
import DownloadScreen from "./DownloadScreen";
import WelcomeScreen from "./WelcomeScreen";
import Settings from "./Routes/Settings";
import CacheScreen from "./CacheScreen";
import Library from "./Routes/Library";
import App from "../Interfaces/App";
import AppsGrid from "./AppsGrid";
import { useState } from "react";
import "./AppLayout.tsx.scss";
import Footer from "./Footer";
import NavBar from "./NavBar";

const AppLayout = () => {
  const [appData, setAppData] = useState<App | undefined>(undefined);

  const [animated, setAnimated] = useState(
    LocalStorage.tryGet(true, "animated-background")
  );

  const [downloadScreen, setDownloadScreen] = useState(false);

  const [welcomeScreen, setWelcomeScreen] = useState(false);

  const [cacheScreen, setCacheScreen] = useState(
    LocalStorage.tryGet(true, "allow-cache")
  );

  const [showInstalledApps, setInstalledApps] = useState(
    LocalStorage.tryGet(true, "show-apps-in-lib")
  );

  const showDownloadScreen = (app: App) => {
    setDownloadScreen(true);
    setAppData(app);
  };

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
            <Route path="/library" element={<Library />} />
          </Routes>
        </div>

        {cacheScreen && (
          <CacheScreen
            setCacheScreen={setCacheScreen}
            setWelcomeScreen={setWelcomeScreen}
          />
        )}

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
