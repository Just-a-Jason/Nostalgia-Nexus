import "./NavBar.tsx.scss";
import NavItem from "./NavItem";
import TitleBar from "./TitleBar";

const NavBar = () => {
  return (
    <>
      <TitleBar />
      <nav className="nav-bar">
        <ul>
          {/* <NavItem route="/apps" icon="icons/apps.svg" text="Apps" /> */}
          <NavItem route="/" icon="icons/games.svg" text="Games" />
          <NavItem
            route="/settings"
            icon="icons/settings.svg"
            text="Settings"
          />
          <NavItem route="/library" icon="icons/library.svg" text="Library" />
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
