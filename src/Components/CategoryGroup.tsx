import { parseCategory } from "../constants";
import Category from "../Interfaces/Category";
import "./CategoryGroup.tsx.scss";
import AppItem from "./AppItem";
import App from "../Interfaces/App";

interface Props {
  category: Category;
  apps?: App[];
  appIds: number[];
}

const CategoryGroup = ({ category, apps }: Props) => {
  return (
    <>
      <h1>{parseCategory(category)}</h1>
      <div className="category-group">
        {apps &&
          apps.map((app, index) => {
            return (
              category == app.category &&
              (<AppItem app={app} appIds={[]} key={index} /> || <></>)
            );
          })}
      </div>
    </>
  );
};

export default CategoryGroup;
