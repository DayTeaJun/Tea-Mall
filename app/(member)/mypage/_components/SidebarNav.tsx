"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserCog } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";

const menu = [
  { name: "내 정보", href: "/mypage/profile" },
  { name: "주문 목록", href: "/mypage/orderList" },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <nav className="flex flex-col h-full bg-white text-sm">
      <ul className="flex flex-col gap-4 h-[70%]">
        {menu.map(({ name, href }) => {
          const isActive = pathname.startsWith(href);

          return (
            <li key={href}>
              <Link
                href={href}
                className={`block px-4 py-2 transition-colors duration-150 ${
                  isActive
                    ? "bg-gray-800 text-white font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>

      {user?.level === 3 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-gray-500 uppercase mb-2 flex items-center gap-2">
            <UserCog size={14} />
            관리자 전용
          </p>
          <Link
            href="/products/manage"
            className={`block px-4 py-2 transition-colors duration-150 ${
              pathname.startsWith("/products/manage")
                ? "bg-gray-800 text-white font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            등록한 상품 관리
          </Link>
        </div>
      )}
    </nav>
  );
}
