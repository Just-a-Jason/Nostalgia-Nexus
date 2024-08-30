import { useEffect, useState } from "react";
import AppStat from "../AppStat";
import "./Settings.tsx.scss";
import { totalInstalledSize } from "../../API/Database";
import { bytesToFileSize } from "../../constants";
import { exists, readBinaryFile } from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import AppSetting from "../AppSetting";
import LocalStorage from "../../API/LocalStorage";
import SettingsGroup from "../SettingsGroup";

interface Props {
  setAnimatedBackGround: (on: boolean) => void;
}

const Settings = ({ setAnimatedBackGround }: Props) => {
  const [totalAppsSize, setTotalAppsSize] = useState(0);
  const [dataBaseSize, setDataBaseSize] = useState(0);

  const [cache, setCache] = useState(LocalStorage.tryGet(true, "allow-cache"));
  const [background, setBackGround] = useState(
    LocalStorage.tryGet(true, "animated-background")
  );

  const [runAfterDownload, setRunAfterDownload] = useState(
    LocalStorage.tryGet(true, "run-after-download")
  );

  const [shortCut, setShortCut] = useState(
    LocalStorage.tryGet(true, "create-shortcut")
  );

  const [animations, setAnimations] = useState(
    LocalStorage.tryGet(true, "ui-animations")
  );

  const fetchFileSize = async () => {
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
      <SettingsGroup
        title="Statistics"
        icon={{ src: "icons/cpu.svg", alt: "cpu icon" }}
      >
        <AppStat
          icon="icons/database.svg"
          title="Database size"
          content={bytesToFileSize(dataBaseSize, 2)!}
        />
        <AppStat
          title="Installed apps size"
          icon="icons/disk.svg"
          content={bytesToFileSize(totalAppsSize, 2)!}
        />
      </SettingsGroup>

      <SettingsGroup
        title="General Settings"
        icon={{ src: "icons/settings.svg", alt: "settings icon" }}
      >
        <AppSetting
          onCheckedChanged={(checked) => {
            LocalStorage.set("animated-background", checked);
            setAnimatedBackGround(checked);
            setBackGround(checked);
          }}
          title="Show animated background"
          checked={background}
        />
        <AppSetting
          onCheckedChanged={(checked) => {
            LocalStorage.set("allow-cache", checked);
            setCache(checked);
          }}
          title="Allow assets cache"
          checked={cache}
        />
      </SettingsGroup>

      <SettingsGroup
        title="Instalation Settings"
        icon={{ src: "icons/download.svg", alt: "settings icon" }}
      >
        <AppSetting
          onCheckedChanged={(checked) => {
            LocalStorage.set("create-shortcut", checked);
            setShortCut(checked);
          }}
          title="Create desktop shortcut"
          checked={shortCut}
        />
        <AppSetting
          onCheckedChanged={(checked) => {
            LocalStorage.set("run-after-download", checked);
            setRunAfterDownload(checked);
          }}
          title="Run game after download"
          checked={runAfterDownload}
        />
      </SettingsGroup>

      <SettingsGroup
        title="UI Settings"
        icon={{ src: "icons/ui.svg", alt: "ui icon" }}
      >
        <AppSetting
          onCheckedChanged={(checked) => {
            LocalStorage.set("ui-animations", checked);
            setAnimations(checked);
          }}
          title="UI animations"
          checked={animations}
        />
      </SettingsGroup>
    </div>
  );
};

export default Settings;
