import DownloadScreen from "./DownloadScreen";
import { App } from "../Interfaces/App";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import "./AppLayout.tsx.scss";
import Footer from "./Footer";
import NavBar from "./NavBar";
import AppsGrid from "./AppsGrid";
import Settings from "./Routes/Settings";

const AppLayout = () => {
  const [downloadScreen, setDownloadScreen] = useState(false);
  const [appData, setAppData] = useState<App | undefined>(undefined);

  const showDownloadScreen = (app: App) => {
    setDownloadScreen(true);
    setAppData(app);
  };

  const hideDownloadScreen = () => setDownloadScreen(false);

  return (
    <Router>
      <section className="app-layout">
        <NavBar />

        <div className="app-router">
          <Routes>
            <Route
              path="/"
              element={<AppsGrid showDownloadScreen={showDownloadScreen} />}
            />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>

        {downloadScreen && (
          <DownloadScreen
            app={appData}
            hideDownloadScreen={hideDownloadScreen}
          />
        )}

        <Footer />
      </section>
    </Router>
  );
};

export default AppLayout;
