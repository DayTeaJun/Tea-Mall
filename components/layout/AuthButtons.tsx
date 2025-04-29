"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { LogIn, SquareUserRound } from "lucide-react";
import Link from "next/link";
import SignOutBtn from "../buttons/SignOutBtn";

export default function AuthButtons() {
  const { user } = useAuthStore();

  return user ? (
    <SignOutBtn />
  ) : (
    <>
      <Link href="/signin" className="text-black flex gap-1 items-center">
        <p className="text-[14px]">로그인</p>
        <LogIn size={16} />
      </Link>
      <Link href="/signup" className="text-black flex gap-1 items-center">
        <p className="text-[14px]">회원가입</p>
        <SquareUserRound size={16} />
      </Link>
    </>
  );
}
