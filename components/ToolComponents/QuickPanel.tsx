"use client";

import { usePathname } from "next/navigation";
import SideQuickMenu from "@/app/_components/SideQuickMenu";
import ToolComponent from "./ToolComponent";

function QuickPanel() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <aside className="hidden 2xl:block fixed top-[118px] right-[calc((100vw-80rem)/2-8rem)] w-28 z-40">
      <SideQuickMenu />
      <ToolComponent />
    </aside>
  );
}

export default QuickPanel;
