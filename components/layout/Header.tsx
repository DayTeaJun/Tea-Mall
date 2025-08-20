import { LogIn, SquareUserRound, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import SignOutBtn from "../common/buttons/SignOutBtn";
import { UserType } from "@/types/user";
import CartLinkBtn from "../common/buttons/CartLinkBtn";
import SearchInput from "../ui/SearchInput";

async function Header({ user }: { user: UserType | null }) {
  return (
    <header className="w-full fixed top-0 left-0 border-b-2 border-gray-100 bg-white z-50">
      <div className="w-full flex flex-col">
        <div className="w-full bg-gray-100 px-4 sm:px-8">
          <div className="w-full max-w-7xl mx-auto flex items-center gap-4 h-10 justify-end ">
            <h1 className="mr-auto text-green-600 text-[14px] sm:hidden">
              <Link href="/" className="text-green-600 font-bold">
                Tea Mall
              </Link>
            </h1>

            {user ? (
              <>
                <SignOutBtn />

                <Link
                  href={`/mypage`}
                  className="text-black flex gap-1 items-center"
                >
                  <p className="text-[12px] sm:text-[14px]">마이페이지</p>
                  <User size={16} className="hidden sm:block" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-black flex gap-1 items-center"
                >
                  <p className="text-[12px] sm:text-[14px]">로그인</p>
                  <LogIn size={16} className="hidden sm:block" />
                </Link>
                <Link
                  href="/signup"
                  className="text-black flex gap-1 items-center"
                >
                  <p className="text-[12px] sm:text-[14px]">회원가입</p>
                  <SquareUserRound size={16} className="hidden sm:block" />
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto py-2 px-8 flex items-center h-14 justify-between bg-white">
          <h1 className="text-green-600 text-2xl sm:block hidden">
            <Link href="/" className="text-green-600 font-bold">
              Tea Mall
            </Link>
          </h1>
          <nav className="flex gap-4 items-center ml-auto">
            <SearchInput />

            <div className="flex-shrink-0">
              <CartLinkBtn />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
