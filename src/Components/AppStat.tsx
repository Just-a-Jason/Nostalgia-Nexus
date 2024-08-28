import "./AppStat.tsx.scss";

interface Props {
  content: string;
  icon: string;
  title: string;
}

const AppStat = ({ content, icon, title }: Props) => {
  return (
    <div className="app-stat">
      <h3>{title}</h3>
      <div className="wrapper">
        <img src={icon} alt="stat icon" draggable={false} />
        {content}
      </div>
    </div>
  );
};

export default AppStat;
