import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";

interface Props {
  user: {
    id: string;
    email: string;
    user_name: string;
    level: number;
  } | null;

  children: React.ReactNode;
}

function LayoutSection({ children, user }: Props) {
  return (
    <>
      <Header user={user} />
      <Main>{children}</Main>
      <Footer />
    </>
  );
}

export default LayoutSection;
