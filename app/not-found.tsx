import { Lock } from "lucide-react";
import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="text-center py-20 flex flex-col items-center justify-center gap-6">
      <Lock size={100} className="text-yellow-500 mb-5" />
      <h1 className="text-2xl font-bold">접근 권한이 없습니다.</h1>
      <p className="text-gray-500 text-[14px]">
        해당 페이지에 접근할 수 있는 권한이 없습니다.
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
