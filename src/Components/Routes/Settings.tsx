import { useEffect, useState } from "react";
import AppStat from "../AppStat";
import "./Settings.tsx.scss";
import { totalInstalledSize } from "../../API/Database";
import { bytesToFileSize } from "../../constants";
import { exists, readBinaryFile } from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";

const Settings = () => {
  const [totalAppsSize, setTotalAppsSize] = useState(0);
  const [dataBaseSize, setDataBaseSize] = useState(0);

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
    </div>
  );
};

export default Settings;
