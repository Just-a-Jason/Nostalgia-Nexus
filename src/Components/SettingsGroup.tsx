import React from "react";
import SvgIcon from "./SvgIcon";

interface Props {
  title: string;
  icon?: { src: string; alt: string };
  children: React.ReactNode;
}

const SettingsGroup = ({ children, icon, title }: Props) => {
  return (
    <div className="settings-group">
      <h1>
        {title} {icon && <SvgIcon src={icon.src} alt={icon.alt} />}
      </h1>
      {children}
    </div>
  );
};

export default SettingsGroup;
