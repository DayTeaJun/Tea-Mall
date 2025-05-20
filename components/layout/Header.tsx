import {
  LogIn,
  Search,
  ShoppingBag,
  ShoppingCart,
  SquareUserRound,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import SignOutBtn from "../common/buttons/SignOutBtn";
import { UserType } from "@/types/user";

async function Header({ user }: { user: UserType | null }) {
  console.log(user?.level);

  return (
    <header className="w-full fixed top-0 left-0 border-b-2 border-gray-100 z-50">
      <div className="w-full flex flex-col">
        <div className="w-full h-10 flex items-center gap-4 justify-end bg-gray-100 py-2 px-20">
          {user ? (
            <>
              <SignOutBtn />

              {(user?.level ?? 1) >= 2 && (
                <Link
                  href="/productRegist"
                  className="text-black flex gap-1 items-center"
                >
                  <p className="text-[14px]">상품등록</p>
                  <ShoppingBag size={16} />
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-black flex gap-1 items-center"
              >
                <p className="text-[14px]">로그인</p>
                <LogIn size={16} />
              </Link>
              <Link
                href="/signup"
                className="text-black flex gap-1 items-center"
              >
                <p className="text-[14px]">회원가입</p>
                <SquareUserRound size={16} />
              </Link>
            </>
          )}
        </div>

        <div className="w-full px-20 py-2 mx-auto flex items-center h-full justify-between bg-white">
          <h1 className="text-green-600 text-2xl ">
            <Link href="/" className="text-green-600 font-bold">
              Tea Mall
            </Link>
          </h1>
          <nav className="flex gap-4 items-center">
            <button className="cursor-pointer p-1">
              <Search size={20} />
            </button>

            <button className="cursor-pointer p-1">
              <ShoppingCart size={20} />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
