import "./WelcomeScreen.tsx.scss";
import SvgIcon from "./SvgIcon";
import Settings from "./Routes/Settings";

interface Props {
  showAnimatedBackground: (on: boolean) => void;
  showInstalledApps: (on: boolean) => void;
  hideWelcomeScreen: () => void;
}

const WelcomeScreen = ({
  showAnimatedBackground,
  hideWelcomeScreen,
  showInstalledApps,
}: Props) => {
  return (
    <div data-tauri-drag-region className="welcome-screen">
      <header>
        <h1>
          Welcome to <span>Nostalgia Nexus!</span>
        </h1>
        <SvgIcon src="icons/icon.svg" alt="nostalgia nexus logo" />
      </header>

      <p>
        Customize your experience! (You can change that any time in settings
        tab)
      </p>

      <Settings
        showInstalledApps={showInstalledApps}
        setAnimatedBackGround={showAnimatedBackground}
        hideStats={true}
      />

      <button onClick={hideWelcomeScreen}>
        Continue <SvgIcon src="icons/flag.svg" alt="flag icon" />
      </button>
    </div>
  );
};

export default WelcomeScreen;
