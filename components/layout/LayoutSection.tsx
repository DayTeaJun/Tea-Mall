import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import { UserType } from "@/types/user";
import QuickPanel from "../ToolComponents/QuickPanel";
import MobileToolFab from "../ToolComponents/MobileToolFab";

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

      <QuickPanel />
      <MobileToolFab />
    </>
  );
}

export default LayoutSection;
