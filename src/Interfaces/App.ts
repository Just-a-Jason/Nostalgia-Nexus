export interface App {
  Description: string;
  IconName: string;
  AppName: string;
  Versions: Version[];
  ReleseDate: string;
}

interface Version {
  AppVersion: string;
  FileSize: string;
  FileID: string;
}
