import { ReactNode } from "react";
import SidebarNav from "./_components/SidebarNav";

export default function MyPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 flex flex-col md:flex-row gap-8">
      <div className="block md:hidden">
        <SidebarNav />
      </div>

      <aside className="w-1/6 border-r pr-4 min-h-[calc(100vh-225px)] hidden md:block">
        <SidebarNav />
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}
