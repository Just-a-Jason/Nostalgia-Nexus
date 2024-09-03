import Category from "./Category";

export default interface App {
  description: string;
  download: Download;
  releseDate: string;
  category: Category;
  iconUrl: string;
  name: string;

  setInLib?: (inLib: boolean) => void;
}

interface Download {
  fileSize: string;
  version: string;
  fileID: string;
}
