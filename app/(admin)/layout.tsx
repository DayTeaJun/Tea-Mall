import { ReactNode } from "react";
import SidebarNav from "./_components/SidebarNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto flex max-w-7xl flex-col md:flex-row gap-2 md:gap-8 p-4 md:p-8">
      <div className="md:hidden">
        <div className="fixed left-0 right-0 top-[96px] z-20 bg-white">
          <div className="mx-auto w-full px-4 pt-4">
            <SidebarNav />
          </div>
        </div>
      </div>

      <aside className="hidden md:block w-1/6 border-r pr-4 min-h-[calc(100vh-225px)]">
        <SidebarNav />
      </aside>

      <main className="flex-1 mt-4 md:mt-0">{children}</main>
    </div>
  );
}
