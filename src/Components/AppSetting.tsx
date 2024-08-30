import "./AppStat.tsx.scss";
import CheckBox from "./CheckBox";

interface Props {
  title: string;
  onCheckedChanged: (checked: boolean) => void;
  checked: boolean;
}

const AppSetting = ({ title, onCheckedChanged, checked }: Props) => {
  return (
    <div className="app-stat">
      <h3>{title}</h3>
      <div className="wrapper">
        <CheckBox checked={checked} onValueChanged={onCheckedChanged} />
      </div>
    </div>
  );
};

export default AppSetting;
