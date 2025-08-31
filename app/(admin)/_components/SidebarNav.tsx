"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Menu, User, UserCog } from "lucide-react";
import { useState } from "react";

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

const detailPage = [
  { href: "/products/orderList/orderDetail" },
  { href: "/edit" },
];

export default function SidebarNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((v) => !v);

  return (
    <nav className="flex flex-col h-full bg-white text-sm">
      <div className="sm:hidden relative pb-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-controls="mypage-nav-list"
              className="flex items-center justify-between active:scale-[0.99] transition"
            >
              <Menu size={18} />
            </button>

            <p className="text-xs uppercase flex items-center gap-2 w-fit font-bold text-gray-500">
              <UserCog size={16} />
              관리자 전용
            </p>
          </div>

          {detailPage.some(({ href }) => pathname.match(href)) && (
            <button
              type="button"
              onClick={() => router.back()}
              className="text-gray-600"
            >
              <ArrowLeft size={18} />
            </button>
          )}
        </div>

        <ul
          className={`absolute mt-2 w-full bg-white z-50 overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            open ? "max-h-96 border-b border-t" : "max-h-0"
          }`}
        >
          {menu.map(({ name, href, currentPage }) => {
            const isActive = pathname.startsWith(currentPage);

            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
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

          <div className="mt-4 pt-4 border-t">
            <Link
              href="/mypage/profile"
              className="text-xs text-gray-500 uppercase mb-2 flex items-center gap-2 hover:text-red-400"
            >
              <User size={14} />내 정보 메뉴 이동
            </Link>
          </div>
        </ul>
      </div>

      <div className="hidden md:block">
        <ul className="flex flex-col gap-4 h-[50vh]">
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

        <div className="mt-4 pt-4 border-t">
          <Link
            href="/mypage/profile"
            className="text-xs text-gray-500 uppercase mb-2 flex items-center gap-2 hover:text-red-400"
          >
            <User size={14} />내 정보 메뉴 이동
          </Link>
        </div>
      </div>
    </nav>
  );
}
