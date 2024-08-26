import "./TitleBarButton.tsx.scss";

interface Props {
  onClick: () => void;
  title: string;
  icon: string;
}

const TitleBarButton = ({ icon, onClick, title }: Props) => {
  return (
    <img
      className="title-bar-button"
      onClick={onClick}
      title={title}
      src={icon}
      alt="title bar button"
    />
  );
};

export default TitleBarButton;
