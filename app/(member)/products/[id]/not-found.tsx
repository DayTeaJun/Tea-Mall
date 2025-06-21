import { CircleAlert } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-20 flex flex-col items-center justify-center gap-6">
      <CircleAlert size={100} className="text-red-500 mb-5" />
      <h1 className="text-2xl font-bold">상품을 찾을 수 없습니다.</h1>
      <p className="text-gray-500 text-[14px]">
        해당 상품이 존재하지 않거나 삭제되었습니다.
      </p>

      <Link
        href="/"
        className="bg-gray-800 rounded-md px-5 py-3 hover:underline cursor-pointer text-white text-sm font-bold block text-center"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
