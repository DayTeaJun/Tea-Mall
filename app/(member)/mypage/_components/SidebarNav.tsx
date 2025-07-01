"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const menu = [
  { name: "내 정보", href: "/mypage/profile" },
  { name: "주문 목록", href: "/mypage/orderList" },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-4 text-sm">
      {menu.map(({ name, href }) => (
        <Link
          key={href}
          href={href}
          className={`hover:bg-gray-300 hover:text-white px-2 py-1${
            pathname.startsWith(href)
              ? "font-bold px-2 py-1 bg-gray-300 text-white"
              : ""
          }`}
        >
          {name}
        </Link>
      ))}
    </nav>
  );
}
