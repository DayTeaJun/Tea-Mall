"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { User, UserCog } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";

const menu = [
  { name: "내 정보", currentPage: "/mypage/profile", href: "/mypage/profile" },
  {
    name: "주문 내역",
    currentPage: "/mypage/orderList",
    href: "/mypage/orderList?page=1",
  },
  { name: "장바구니", currentPage: "/mypage/myCart", href: "/mypage/myCart" },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <nav className="flex flex-col h-full bg-white text-sm">
      <ul className="flex flex-col gap-4 md:h-[50vh]">
        {user ? (
          <p className="text-xs text-gray-500 uppercase mb-2 flex items-center gap-2 border-b-2 border-gray-400 pb-2 w-fit font-bold">
            <User size={16} />
            <span className="text-green-600">{`${user?.user_name}`}</span> 님
          </p>
        ) : (
          <div className="h-[12px] pb-2" />
        )}

        {menu.map(({ name, href, currentPage }) => {
          const isActive = pathname.startsWith(currentPage);

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
          <Link
            href="/products/manage"
            className="text-xs text-gray-500 uppercase mb-2 flex items-center gap-2 hover:text-red-400"
          >
            <UserCog size={14} />
            관리자 메뉴 이동
          </Link>
        </div>
      )}
    </nav>
  );
}
