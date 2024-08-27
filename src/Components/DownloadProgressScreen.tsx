import "./DownloadProgressScreen.tsx.scss";

interface Props {
  progress: number;
}

const DownloadProgressScreen = ({ progress }: Props) => {
  return (
    <section data-tauri-drag-region className="download-progress-screen">
      <h1>
        Downloading files...
        <img src="icons/spinner.svg" alt="loading spinner" />
      </h1>
      <div className="progress-bar">
        <p>{progress.toFixed(1)} %</p>
        <div
          className="progress-bar-fill"
          style={{
            width: `${progress === 0 ? 2 : progress}%`,
          }}
        ></div>
      </div>
    </section>
  );
};

export default DownloadProgressScreen;
