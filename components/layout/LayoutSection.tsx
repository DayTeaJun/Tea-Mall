import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";

function LayoutSection({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </>
  );
}

export default LayoutSection;
