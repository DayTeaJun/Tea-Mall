"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { User, UserCog, Menu, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";

const menu = [
  { name: "내 정보", currentPage: "/mypage/profile", href: "/mypage/profile" },
  {
    name: "찜 목록",
    currentPage: "/mypage/bookmark",
    href: "/mypage/bookmark",
  },
  { name: "장바구니", currentPage: "/mypage/myCart", href: "/mypage/myCart" },
  {
    name: "주문 내역",
    currentPage: "/mypage/orderList",
    href: "/mypage/orderList?page=1",
  },
];

const detailPage = [
  { href: "/mypage/profile/edit" },
  {
    href: "/mypage/orderList/orderDetail",
  },
  { href: "/mypage/profile/resetPassword" },
];

export default function SidebarNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((v) => !v);

  return (
    <nav className="flex flex-col h-full bg-white text-sm">
      <div className="md:hidden relative pb-2">
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

            {user ? (
              <p className="text-xs text-gray-500 px-1 flex items-center gap-2 font-bold">
                <User size={14} />
                <span className="text-green-600">{user.user_name}</span> 님
              </p>
            ) : (
              <div className="h-[6px] mt-2" />
            )}
          </div>

          {detailPage.some(({ href }) => pathname.startsWith(href)) && (
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
              <li key={href} className="border-b last:border-b-0">
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 transition-colors duration-150 ${
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

          {user?.level === 3 && (
            <div className="border-b last:border-b-0 py-3">
              <Link
                href="/manage/productList"
                className="text-xs text-gray-500 flex items-center gap-2 hover:text-red-400 px-1"
              >
                <UserCog size={14} />
                관리자 메뉴 이동
              </Link>
            </div>
          )}
        </ul>
      </div>

      <div className="hidden md:block">
        {user ? (
          <p className="text-xs text-gray-500 uppercase mb-2 flex items-center gap-2 border-b-2 border-gray-400 pb-2 w-fit font-bold">
            <User size={16} />
            <span className="text-green-600">{user.user_name}</span> 님
          </p>
        ) : (
          <div className="h-[12px] pb-2" />
        )}

        <ul className="flex flex-col gap-4 md:h-[50vh]">
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
              href="/manage/productList"
              className="text-xs text-gray-500 uppercase mb-2 flex items-center gap-2 hover:text-red-400"
            >
              <UserCog size={14} />
              관리자 메뉴 이동
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
