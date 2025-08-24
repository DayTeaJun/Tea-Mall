"use client";

import { EllipsisVertical } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

export function Dropdown({ children }: { children: ReactNode }) {
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

  return (
    <div ref={menuRef} className="w-[200px] text-end text-black relative">
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
        <ul className="text-black text-end">{children}</ul>
      </div>
    </div>
  );
}
