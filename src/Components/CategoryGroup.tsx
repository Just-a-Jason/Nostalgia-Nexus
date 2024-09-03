import { parseCategory } from "../constants";
import Category from "../Interfaces/Category";
import "./CategoryGroup.tsx.scss";
import AppItem from "./AppItem";
import App from "../Interfaces/App";
import SvgIcon from "./SvgIcon";
import { useState } from "react";

interface Props {
  showDownloadScreen: (app: App) => void;
  showIfInLib: boolean;
  category: Category;
  appIds: string[];
  apps: App[];
}

const CategoryGroup = ({
  category,
  apps,
  appIds,
  showDownloadScreen,
  showIfInLib,
}: Props) => {
  const [categoryShown, setCategoryShown] = useState(true);

  const categorized = apps.slice(0).filter((app) => app.category === category);

  return (
    <>
      <h1
        className="category-title"
        onClick={() => setCategoryShown(!categoryShown)}
      >
        {parseCategory(category)}
        {` `}
        {`[ ${categorized.length} games ]`}
        <SvgIcon alt="archive" src="icons/archive.svg" />
      </h1>
      {categoryShown && (
        <div className="category-group">
          {categorized.map((app, index) => {
            return (
              category === app.category &&
              ((
                <AppItem
                  app={app}
                  appIds={appIds}
                  showDownloadScreen={showDownloadScreen}
                  showIfInLib={showIfInLib}
                  key={index}
                />
              ) || <></>)
            );
          })}
        </div>
      )}
    </>
  );
};

export default CategoryGroup;
