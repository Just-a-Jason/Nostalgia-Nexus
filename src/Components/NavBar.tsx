import "./NavBar.tsx.scss";
import NavItem from "./NavItem";
import TitleBar from "./TitleBar";

const NavBar = () => {
  return (
    <>
      <TitleBar />
      <nav className="nav-bar">
        <ul>
          <NavItem icon="icons/apps.svg" text="Apps" />
          <NavItem icon="icons/games.svg" text="Games" />
          <NavItem icon="icons/settings.svg" text="Settings" />
          <NavItem icon="icons/library.svg" text="Library" />
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
