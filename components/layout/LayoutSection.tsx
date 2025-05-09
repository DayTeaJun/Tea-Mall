import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import { UserType } from "@/types/user";

interface Props {
  user: UserType | null;

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
