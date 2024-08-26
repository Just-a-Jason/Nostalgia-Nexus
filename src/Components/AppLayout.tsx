import AppsGrid from "./AppsGrid";
import "./AppLayout.tsx.scss";
import Footer from "./Footer";
import NavBar from "./NavBar";

const AppLayout = () => {
  return (
    <section className="app-layout">
      <NavBar />
      <AppsGrid />
      <Footer />
    </section>
  );
};

export default AppLayout;
