import { ReactNode } from "react";
import SidebarNav from "./_components/SidebarNav";

export default function MyPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-2 sm:gap-8 relative p-4 sm:p-8">
      <div className="md:hidden">
        <div className="fixed top-[96px]  w-full z-20">
          <SidebarNav />
        </div>
      </div>

      <aside className="hidden md:block w-1/6 border-r pr-4 min-h-[calc(100vh-225px)]">
        <SidebarNav />
      </aside>

      <main className="flex-1 mt-4 sm:mt-0">{children}</main>
    </div>
  );
}
