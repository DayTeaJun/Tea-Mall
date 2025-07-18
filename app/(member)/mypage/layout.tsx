import { ReactNode } from "react";
import SidebarNav from "./_components/SidebarNav";

export default function MyPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto p-8 flex gap-8">
      <aside className="w-1/6 border-r pr-4 min-h-[calc(100vh-225px)]">
        <SidebarNav />
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
