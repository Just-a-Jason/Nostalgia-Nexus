import { bytesToFileSize } from "../constants";
import { DownloadPayload } from "../Interfaces/DownloadPayload";
import "./DownloadProgressScreen.tsx.scss";
import SvgIcon from "./SvgIcon";

interface Props {
  payload?: DownloadPayload;
}

const timeEndings = ["sec", "min", "h"];

const secToTime = (time: number | undefined) => {
  if (time === undefined) return;

  let fileEnding = 0;

  while (time > 60) {
    time /= 60;
    fileEnding++;
  }

  if (fileEnding > timeEndings.length) fileEnding = timeEndings.length - 1;

  return `${time.toFixed(0)} ${timeEndings[fileEnding]}`;
};

const DownloadProgressScreen = ({ payload }: Props) => {
  return (
    <section data-tauri-drag-region className="download-progress-screen">
      <h1>
        {payload?.operation || "The download will start soon..."}
        {payload && <SvgIcon src="icons/spinner.svg" alt="loading spinner" />}
      </h1>
      <div className="progress-bar">
        <p>{payload?.progress.toFixed(1) || "0"} %</p>
        <div
          className="progress-bar-fill"
          style={{
            width: `${
              payload?.progress === 0 || !payload ? 2 : payload?.progress
            }%`,
          }}
        ></div>
      </div>
      {payload?.operation === "Downloading files..." && (
        <p className="statistic">
          Remaining time: {secToTime(payload?.remainingTime) || "0 sec"}
        </p>
      )}
      {payload?.operation === "Downloading files..." && (
        <p className="statistic">
          Downloaded: {bytesToFileSize(payload?.downloaded) || "0 MB"} /{" "}
          {bytesToFileSize(payload?.fileSize) || "0 MB"}
        </p>
      )}
    </section>
  );
};

export default DownloadProgressScreen;
