import { DownloadPayload } from "../Interfaces/DownloadPayload";
import "./DownloadProgressScreen.tsx.scss";

interface Props {
  payload?: DownloadPayload;
}

const fileEndings = ["B", "KB", "MB", "GB", "TB"];
const timeEndings = ["sec", "min", "h"];

const bytesToFileSize = (fileSize: number | undefined) => {
  if (fileSize === undefined) return;

  let fileEnding = 0;

  while (fileSize > 1024) {
    fileSize /= 1024;
    fileEnding++;
  }

  if (fileEnding > fileEndings.length) fileEnding = fileEndings.length - 1;

  return `${fileSize.toFixed(0)} ${fileEndings[fileEnding]}`;
};

const secToTime = (time: number | undefined) => {
  if (time === undefined) return;

  let fileEnding = 0;

  while (time > 60) {
    time /= 60;
    fileEnding++;
  }

  if (fileEnding > fileEndings.length) fileEnding = fileEndings.length - 1;

  return `${time.toFixed(0)} ${timeEndings[fileEnding]}`;
};

const DownloadProgressScreen = ({ payload }: Props) => {
  return (
    <section data-tauri-drag-region className="download-progress-screen">
      <h1>
        Downloading files...
        <img src="icons/spinner.svg" alt="loading spinner" />
      </h1>
      <div className="progress-bar">
        <p>{payload?.progress.toFixed(1)} %</p>
        <div
          className="progress-bar-fill"
          style={{
            width: `${payload?.progress === 0 ? 0.5 : payload?.progress}%`,
          }}
        ></div>
      </div>
      <p className="statistic">
        Remaining time: {secToTime(payload?.remainingTime) || "0 sec"}
      </p>
      <p className="statistic">
        Downloaded: {bytesToFileSize(payload?.downloaded) || "0 MB"} /{" "}
        {bytesToFileSize(payload?.fileSize) || "0 MB"}
      </p>
    </section>
  );
};

export default DownloadProgressScreen;
