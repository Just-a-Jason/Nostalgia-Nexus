import { useEffect, useState } from "react";
import AppStat from "../AppStat";
import "./Settings.tsx.scss";
import { totalInstalledSize } from "../../API/Database";
import { bytesToFileSize } from "../../constants";

const Settings = () => {
  const [totalAppsSize, setTotalAppsSize] = useState(0);

  const fetchFileSize = async () => {
    const sizes: any[] = (await totalInstalledSize()) as any[];

    if (sizes.length === 0 || sizes[0]["totalSize"] === null) return;

    setTotalAppsSize(sizes[0]["totalSize"]);
  };

  useEffect(() => {
    fetchFileSize();
  }, []);
  return (
    <div className="settings route">
      <AppStat
        icon="icons/database.svg"
        title="Database size"
        content={"Calculating..."}
      />
      <AppStat
        title="Installed apps size"
        icon="icons/disk.svg"
        content={bytesToFileSize(totalAppsSize)!}
      />
    </div>
  );
};

export default Settings;
