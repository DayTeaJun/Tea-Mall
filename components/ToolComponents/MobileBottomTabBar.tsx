"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  LayoutGrid,
  MessageCircle,
  ShoppingCart,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useProductAllCart } from "@/lib/queries/products";
import { useChatUnread } from "@/hooks/useChatUnread";
import ChattingModal from "./chat/ChattingModal";

export default function MobileBottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: cartItems } = useProductAllCart(user?.id ?? "");
  const { unreadCount, markOpen } = useChatUnread();
  const [isChatting, setIsChatting] = useState(false);

  const cartCount = cartItems?.length ?? 0;

  const isMyPage =
    pathname.startsWith("/mypage") && !pathname.startsWith("/mypage/myCart");
  const isCart = pathname.startsWith("/mypage/myCart");
  const isCategory = pathname.startsWith("/category");
  const isHome = pathname === "/";

  const handleChatClick = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      router.push("/signin");
      return;
    }
    const next = !isChatting;
    setIsChatting(next);
    await markOpen(next);
  };

  const tabClass = (active: boolean) =>
    `flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] ${
      active ? "text-green-600" : "text-gray-500"
    }`;

  return (
    <>
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch bg-white border-t border-gray-200"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <Link href="/" className={tabClass(isHome)}>
          <Home size={20} />홈
        </Link>

        <Link href="/category" className={tabClass(isCategory)}>
          <LayoutGrid size={20} />
          카테고리
        </Link>

        <button
          type="button"
          onClick={handleChatClick}
          className={tabClass(isChatting)}
        >
          <span className="relative">
            <MessageCircle size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center animate-pulse">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </span>
          채팅
        </button>

        <Link href="/mypage/myCart" className={tabClass(isCart)}>
          <span className="relative">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </span>
          장바구니
        </Link>

        <Link href="/mypage" className={tabClass(isMyPage)}>
          <User size={20} />
          마이페이지
        </Link>
      </nav>

      {isChatting && (
        <ChattingModal fullScreen onClose={() => setIsChatting(false)} />
      )}
    </>
  );
}
