import React from "react";
import { ShieldAlert, Mail } from "lucide-react";
import Link from "next/link";

export default function RestrictedPage() {
  return (
    <div className="py-20 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          서비스 이용이 제한되었습니다
        </h1>
        <p className="text-gray-500 leading-relaxed mb-8">
          안녕하세요. 안전한 커뮤니티 운영 가이드에 따라 <br />
          현재 고객님의 계정 활동이 일시적으로 제한되었습니다. <br />본 조치에
          대해 궁금하신 점은 고객센터로 문의해 주세요.
        </p>

        <Link
          href="mailto:support@yourdomain.com"
          className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          <Mail size={18} />
          고객센터에 문의하기
        </Link>

        <p className="mt-8 text-xs text-gray-400">
          30일 이내에 문의하지 않으면 계정이 영구 정지될 수 있습니다.
        </p>
      </div>
    </div>
  );
}
