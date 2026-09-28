import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import { UserType } from "@/types/user";
import QuickPanel from "../ToolComponents/QuickPanel";
import MobileBottomTabBar from "../ToolComponents/MobileBottomTabBar";
import ChatWidget from "../ToolComponents/ChatWidget";

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
      <MobileBottomTabBar />
      <ChatWidget />
    </>
  );
}

export default LayoutSection;
