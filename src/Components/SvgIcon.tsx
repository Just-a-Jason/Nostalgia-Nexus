interface Props {
  src: string;
  alt: string;
}

const SvgIcon = ({ src, alt }: Props) => {
  return <img src={src} alt={alt} draggable={false} />;
};

export default SvgIcon;
