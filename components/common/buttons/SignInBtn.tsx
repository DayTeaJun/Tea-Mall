"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";

export default function SignInBtn() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();
  const currentPath = queryString ? `${pathname}?${queryString}` : pathname;

  const signInUrl =
    pathname.startsWith("/signin") || pathname.startsWith("/signup")
      ? "/signin"
      : `/signin?redirectTo=${encodeURIComponent(currentPath)}`;

  return (
    <Link href={signInUrl} className="text-black flex gap-1 items-center">
      <p className="text-[12px] sm:text-[14px]">로그인</p>
      <LogIn size={16} className="hidden sm:block" />
    </Link>
  );
}
