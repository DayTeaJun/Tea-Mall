"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserCog } from "lucide-react";

const menu = [
  {
    name: "등록 상품 관리",
    currentPage: "/products/manage",
    href: "/products/manage",
  },
  {
    name: "상품 등록",
    currentPage: "/products/regist",
    href: "/products/regist",
  },
  {
    name: "주문 상태 관리",
    currentPage: "/products/orderList",
    href: "/products/orderList?query=&page=1",
  },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col h-full bg-white text-sm">
      <ul className="flex flex-col gap-4 h-[70%]">
        <p className="text-xs text-gray-500 uppercase mb-2 flex items-center gap-2 border-b-2 border-gray-400 pb-2 w-fit font-bold">
          <UserCog size={16} />
          관리자 전용
        </p>
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
    </nav>
  );
}
