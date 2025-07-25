"use client";

import { EllipsisVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Dropdown() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCurrent = () => {
    setIsMenuOpen(false);
  };

  return (
    <div ref={menuRef} className="w-[280px] text-end text-black relative">
      <button
        type="button"
        aria-label="메뉴 열기"
        className="text-gray-400"
        onClick={toggleMenu}
      >
        <EllipsisVertical size={24} />
      </button>

      <div
        className={`absolute top-[30px] right-2 bg-white shadow-md transition-all duration-300 border-t border-l border-b border-solid border-gray-200 ${
          isMenuOpen ? "max-h-[500px] opacity-[0.98]" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <ul className="border-t border-solid border-white text-black text-end">
          <li className="hover:text-gray-800 w-full">
            <button
              type="button"
              onClick={handleCurrent}
              className="px-3 py-2 text-start w-full tracking-wide"
            >
              주문내역 삭제
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
