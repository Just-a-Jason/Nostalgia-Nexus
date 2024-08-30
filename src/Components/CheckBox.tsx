import "./CheckBox.tsx.scss";

interface Props {
  onValueChanged: (checked: boolean) => void;
  checked: boolean;
}

const CheckBox = ({ onValueChanged, checked }: Props) => {
  return (
    <label className="app-checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onValueChanged(e.currentTarget.checked)}
      />
      <span className="slider"></span>
    </label>
  );
};

export default CheckBox;
