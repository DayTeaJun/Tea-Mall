"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, ArrowLeft } from "lucide-react";

const menu = [
  {
    name: "이용 약관",
    currentPage: "/policy/terms",
    href: "/policy/terms",
  },
  {
    name: "개인정보 처리방침",
    currentPage: "/policy/privacy",
    href: "/policy/privacy",
  },
];

export default function SidebarPolicy() {
  const router = useRouter();
  const pathname = usePathname();
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

            <p className="text-xs text-gray-500 w-fit font-bold">
              <span className="text-green-600">이용 안내</span>
            </p>
          </div>

          {menu.some(({ href }) => pathname.startsWith(href)) && (
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
        </ul>
      </div>

      <div className="hidden md:block">
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
      </div>
    </nav>
  );
}
