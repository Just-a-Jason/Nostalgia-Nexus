import CheckBox from "./CheckBox";
import "./DownloadOption.tsx.scss";
interface Props {
  setIsOn: (on: boolean) => void;
  text: string;
  isOn: boolean;
}

const DownloadOption = ({ text, isOn, setIsOn }: Props) => {
  return (
    <div className="download-option">
      {text}
      <CheckBox checked={isOn} onValueChanged={(checked) => setIsOn(checked)} />
    </div>
  );
};

export default DownloadOption;
