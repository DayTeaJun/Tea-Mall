import AuthProvider from "@/lib/config/supabase/AuthProvider";
import { createServerSupabaseClient } from "@/lib/config/supabase/server";
import { LogIn, Search, ShoppingCart, SquareUserRound } from "lucide-react";
import Link from "next/link";
import React from "react";
import SignOutBtn from "../buttons/SignOutBtn";

async function Header() {
  const supabase = await createServerSupabaseClient();
  const { data: session } = await supabase?.auth?.getSession();

  return (
    <header className="w-full fixed top-0 left-0 h-16 px-20 bg-gray-50 border-b-2 border-gray-100">
      <div className="max-w-6xl mx-auto flex items-center h-full justify-between ">
        <h1 className="text-green-600 text-2xl ">
          <Link href="/" className="text-green-600">
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

          <AuthProvider accessToken={session?.session?.access_token}>
            {session?.session?.user ? (
              <SignOutBtn />
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-black flex gap-1 items-center"
                >
                  <p className="text-[14px] ">로그인</p>
                  <LogIn size={20} />
                </Link>
                <Link
                  href="/signup"
                  className="text-black flex gap-1 items-center"
                >
                  <p className="text-[14px] ">회원가입</p>
                  <SquareUserRound size={20} />
                </Link>
              </>
            )}
          </AuthProvider>
        </nav>
      </div>
    </header>
  );
}

export default Header;
