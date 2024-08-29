export interface App {
  description: string;
  download: Download;
  releseDate: string;
  iconUrl: string;
  name: string;

  setInLib?: (inLib: boolean) => void;
}

interface Download {
  fileSize: string;
  version: string;
  fileID: string;
}
