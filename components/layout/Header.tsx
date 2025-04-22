import { Search, ShoppingCart } from "lucide-react";
import React from "react";

function Header() {
  return (
    <header className="w-full fixed top-0 left-0 h-16 px-20 bg-gray-50 border-b-2 border-gray-100">
      <nav className="max-w-6xl mx-auto flex items-center h-full justify-between ">
        <h1 className="text-green-600 text-2xl ">Tea Mall</h1>
        <div className="flex gap-2">
          <button className="cursor-pointer p-1">
            <Search size={20} />
          </button>

          <button className="cursor-pointer p-1">
            <ShoppingCart size={20} />
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
