type Operation = "Unziping game files..." | "Downloading files...";

export interface DownloadPayload {
  remainingTime: number;
  operation: Operation;
  downloaded: number;
  fileSize: number;
  progress: number;
}
