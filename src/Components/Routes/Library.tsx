import { useEffect, useState } from "react";
import { loadUserLibrary } from "../../API/Database";
import AppInLibrary from "../../Interfaces/AppInLibrary";
import "./Library.tsx.scss";

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
      {library.map((item) => (
        <div className="library-item">
          <div className="info">
            <p>{item.name}</p>
          </div>
          <img src={item.iconUrl} alt={item.name} draggable={false} />
        </div>
      ))}
    </section>
  );
};

export default Library;
