import Link from "next/link";
import { ReactNode } from "react";

export default function MyPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto p-8 flex gap-8">
      <aside className="w-1/4">
        <nav className="flex flex-col gap-4 text-sm">
          <Link href="/mypage/profile" className="hover:underline">
            내 정보
          </Link>
          <Link href="/mypage/orderList" className="hover:underline">
            주문 목록
          </Link>
        </nav>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}
