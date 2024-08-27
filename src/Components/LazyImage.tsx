import { useState } from "react";
import "./LazyImage.tsx.scss";

interface Props {
  src: string;
  alt: string;
}

const LazyImage = ({ src, alt }: Props) => {
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(false);
  };

  return (
    <div className="lazy-image">
      {loading && (
        <img
          className="place-holder"
          src="icons/loading.jpg"
          alt="app loading image"
          draggable={false}
        />
      )}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className={(loading && "hidden") || "lazy-img"}
        onLoad={load}
      />
    </div>
  );
};

export default LazyImage;
