export interface App {
  description: string;
  download: Download;
  releseDate: string;
  iconUrl: string;
  name: string;
}

interface Download {
  fileSize: string;
  version: string;
  fileID: string;
}
