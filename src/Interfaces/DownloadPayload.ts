type Operation =
  | "Unziping game files..."
  | "Downloading files..."
  | "Uninstalling game files...";

export interface DownloadPayload {
  remainingTime: number;
  operation: Operation;
  downloaded: number;
  fileSize: number;
  progress: number;
}
