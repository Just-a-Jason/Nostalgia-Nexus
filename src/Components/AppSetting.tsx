import "./AppStat.tsx.scss";
import CheckBox from "./CheckBox";

interface Props {
  title: string;
  onCheckedChanged: (checked: boolean) => void;
  checked: boolean;
  hint: string;
}

const AppSetting = ({ title, onCheckedChanged, checked, hint }: Props) => {
  return (
    <div className="app-stat" title={hint}>
      <h3>{title}</h3>
      <div className="wrapper">
        <CheckBox checked={checked} onValueChanged={onCheckedChanged} />
      </div>
    </div>
  );
};

export default AppSetting;
