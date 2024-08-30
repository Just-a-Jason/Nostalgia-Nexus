import { useEffect, useState } from "react";
import AppStat from "../AppStat";
import "./Settings.tsx.scss";
import { totalInstalledSize } from "../../API/Database";
import { bytesToFileSize } from "../../constants";
import { exists, readBinaryFile } from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import AppSetting from "../AppSetting";
import SvgIcon from "../SvgIcon";
import LocalStorage from "../../API/LocalStorage";

interface Props {
  setAnimatedBackGround: (on: boolean) => void;
}

const Settings = ({ setAnimatedBackGround }: Props) => {
  const [totalAppsSize, setTotalAppsSize] = useState(0);
  const [dataBaseSize, setDataBaseSize] = useState(0);

  const [background, setBackGround] = useState(
    LocalStorage.tryGet(true, "animated-background")
  );

  const [cache, setCache] = useState(LocalStorage.tryGet(true, "allow-cache"));

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
      <h1>
        Statistics <SvgIcon src="icons/cpu.svg" alt="cpu icon" />
      </h1>

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

      <h1>
        Settings <SvgIcon src="icons/settings.svg" alt="settings icon" />
      </h1>
      <AppSetting
        onCheckedChanged={(checked) => {
          LocalStorage.set("animated-background", checked);
          setAnimatedBackGround(checked);
          setBackGround(checked);
        }}
        title="Animated background"
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
    </div>
  );
};

export default Settings;
