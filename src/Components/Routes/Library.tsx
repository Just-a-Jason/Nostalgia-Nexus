import { useEffect, useState } from "react";
import { loadUserLibrary } from "../../API/Database";
import AppInLibrary from "../../Interfaces/AppInLibrary";
import "./Library.tsx.scss";
import { timeEndings } from "../../constants";

const calculateTime = (time: number) => {
  let i = 0;
  while (time > 60) {
    time /= 60;
    i++;
  }
  if (i > timeEndings.length) i = timeEndings.length - 1;
  return `${time.toFixed(0)} ${timeEndings[i]}`;
};

const Library = () => {
  const [library, setLibrary] = useState<AppInLibrary[]>([]);
  const loadLibrary = async () => setLibrary(await loadUserLibrary());

  // Load user library
  useEffect(() => {
    loadLibrary();
  }, []);

  return (
    <section className="library">
      {library.length === 0 && <h1>Your library is empty</h1>}
      {library.map((item, index) => (
        <div className="library-item" key={index}>
          <div className="info">
            <p className="total-play-time">
              {calculateTime(item.totalPlayTime)}
            </p>
            <p className="title">{item.name}</p>
          </div>
          <img src={item.iconUrl} alt={item.name} draggable={false} />
        </div>
      ))}
    </section>
  );
};

export default Library;
