import AppStat from "../AppStat";
import "./Settings.tsx.scss";

const Settings = () => {
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
        content={"Calculating..."}
      />
    </div>
  );
};

export default Settings;
