import { appWindow as app } from "@tauri-apps/api/window";
import "./TitleBar.tsx.scss";
import TitleBarButton from "./TitleBarButton";

const TitleBar = () => {
  return (
    <section data-tauri-drag-region className="title-bar">
      <p data-tauri-drag-region>Nostalgia Nexus</p>
      <div data-tauri-drag-region className="buttons">
        <TitleBarButton
          onClick={() => app.minimize()}
          icon="icons/minimize.svg"
          title="Minimize app"
        />
        <TitleBarButton
          onClick={() => app.close()}
          icon="icons/close.svg"
          title="Close app"
        />
      </div>
    </section>
  );
};

export default TitleBar;
