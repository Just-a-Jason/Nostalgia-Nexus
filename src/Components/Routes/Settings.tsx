import { exists, readBinaryFile } from "@tauri-apps/api/fs";
import { totalInstalledSize } from "../../API/Database";
import { appDataDir } from "@tauri-apps/api/path";
import { bytesToFileSize } from "../../constants";
import LocalStorage from "../../API/LocalStorage";
import SettingsGroup from "../SettingsGroup";
import { useEffect, useState } from "react";
import AppSetting from "../AppSetting";
import AppStat from "../AppStat";
import "./Settings.tsx.scss";

interface Props {
  setAnimatedBackGround: (on: boolean) => void;
  showInstalledApps: (on: boolean) => void;
  hideStats: boolean;
}

const Settings = ({
  setAnimatedBackGround,
  hideStats = false,
  showInstalledApps,
}: Props) => {
  const [totalAppsSize, setTotalAppsSize] = useState(0);
  const [dataBaseSize, setDataBaseSize] = useState(0);

  const [cache, setCache] = useState(LocalStorage.tryGet(true, "allow-cache"));
  const [background, setBackGround] = useState(
    LocalStorage.tryGet(true, "animated-background")
  );

  const [darkTheme, setDarkTheme] = useState(
    LocalStorage.tryGet(true, "dark-theme")
  );

  const [runAfterDownload, setRunAfterDownload] = useState(
    LocalStorage.tryGet(false, "run-after-download")
  );

  const [shortCut, setShortCut] = useState(
    LocalStorage.tryGet(true, "create-shortcut")
  );

  const [animations, setAnimations] = useState(
    LocalStorage.tryGet(true, "ui-animations")
  );

  const [showAppsInLib, setShowAppsInLib] = useState(
    LocalStorage.tryGet(true, "show-apps-in-lib")
  );

  const [autoUpdates, setAutoUpdates] = useState(
    LocalStorage.tryGet(true, "auto-updates")
  );

  const fetchFileSize = async () => {
    if (hideStats) return;
    const dataBasePath = (await appDataDir()) + "library.db";

    const sizes: any[] = (await totalInstalledSize()) as any[];

    if (sizes.length === 0 || sizes[0]["totalSize"] === null) return;

    setTotalAppsSize(sizes[0]["totalSize"]);

    if (await exists(dataBasePath))
      setDataBaseSize((await readBinaryFile(dataBasePath)).length);
  };

  useEffect(() => {
    fetchFileSize();
  }, []);
  return (
    <div className="settings route">
      {!hideStats && (
        <SettingsGroup
          title="Statistics"
          icon={{ src: "icons/cpu.svg", alt: "cpu icon" }}
        >
          <AppStat
            icon="icons/database.svg"
            hint="Database size used to store & map games in library to acess them from this UI."
            title="Database size"
            content={bytesToFileSize(dataBaseSize, 2)!}
          />
          <AppStat
            title="Cached assets size"
            icon="icons/broom.svg"
            content="0 B"
            hint="Allows you to faster access game icons, list and other stuff based on your internet speed. Just stores the files on your local machine."
          />
          <AppStat
            title="Installed apps size"
            icon="icons/disk.svg"
            hint="Calculated size of apps on your hardrive."
            content={bytesToFileSize(totalAppsSize, 2)!}
          />
        </SettingsGroup>
      )}

      <SettingsGroup
        title="General Settings"
        icon={{ src: "icons/settings.svg", alt: "settings icon" }}
      >
        <AppSetting
          hint="Allows you to faster access game icons, list and other stuff based on your internet speed. Just stores the files on your local machine."
          onCheckedChanged={(checked) => {
            LocalStorage.set("allow-cache", checked);
            setCache(checked);
          }}
          title="Allow assets cache"
          checked={cache}
        />

        <AppSetting
          hint="Toggles display of an game/app if it is in library in Apps/Games section."
          onCheckedChanged={(checked) => {
            LocalStorage.set("show-apps-in-lib", checked);
            setShowAppsInLib(checked);
            showInstalledApps(checked);
          }}
          title="Show installed apps in Games/Apps section."
          checked={showAppsInLib}
        />

        <AppSetting
          hint="Toggles auto app updates to keep it up to date."
          onCheckedChanged={(checked) => {
            LocalStorage.set("show-apps-in-lib", checked);
            setAutoUpdates(checked);
          }}
          title="Auto updates"
          checked={autoUpdates}
        />
      </SettingsGroup>

      <SettingsGroup
        title="Installation Settings"
        icon={{ src: "icons/download.svg", alt: "settings icon" }}
      >
        <AppSetting
          hint="Creates shortcut on your desktop to the game executable file."
          onCheckedChanged={(checked) => {
            LocalStorage.set("create-shortcut", checked);
            setShortCut(checked);
          }}
          title="Create desktop shortcut"
          checked={shortCut}
        />

        <AppSetting
          hint="Allows the installer to run the game after intallation."
          onCheckedChanged={(checked) => {
            LocalStorage.set("run-after-download", checked);
            setRunAfterDownload(checked);
          }}
          title="Auto run game after download"
          checked={runAfterDownload}
        />
      </SettingsGroup>

      <SettingsGroup
        title="UI Settings"
        icon={{ src: "icons/ui.svg", alt: "ui icon" }}
      >
        <AppSetting
          hint="Removes/Adds animations to user interface."
          onCheckedChanged={(checked) => {
            LocalStorage.set("ui-animations", checked);

            const root = document.querySelector("#root") as HTMLDivElement;
            root.classList.remove("no-anim");
            if (!checked) root.classList.add("no-anim");

            setAnimations(checked);
          }}
          title="UI animations"
          checked={animations}
        />

        <AppSetting
          hint="Toggle the visibility of background animation."
          onCheckedChanged={(checked) => {
            LocalStorage.set("animated-background", checked);
            setAnimatedBackGround(checked);
            setBackGround(checked);
          }}
          title="Show animated background"
          checked={background}
        />

        <AppSetting
          hint="Toggle the dark/light theme."
          onCheckedChanged={(checked) => {
            LocalStorage.set("dark-theme", checked);
            setDarkTheme(checked);
          }}
          title="Dark Theme"
          checked={darkTheme}
        />
      </SettingsGroup>
    </div>
  );
};

export default Settings;
