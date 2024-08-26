import "./NavItem.tsx.scss";

interface Props {
  icon: string;
  text: string;
}

const NavItem = ({ icon, text }: Props) => {
  return (
    <li className="nav-item" title={text}>
      {text}
      <img src={icon} alt="navigation menu icon" />
    </li>
  );
};

export default NavItem;
