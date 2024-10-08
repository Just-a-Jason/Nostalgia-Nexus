import { useNavigate } from "react-router-dom";
import "./NavItem.tsx.scss";
import SvgIcon from "./SvgIcon";

interface Props {
  route: string;
  icon: string;
  text: string;
}

const NavItem = ({ icon, text, route }: Props) => {
  const navigation = useNavigate();

  const onClick = () => navigation(route);
  return (
    <li className="nav-item" title={text} onClick={onClick}>
      {text}
      <SvgIcon src={icon} alt="navigation menu icon" />
    </li>
  );
};

export default NavItem;
