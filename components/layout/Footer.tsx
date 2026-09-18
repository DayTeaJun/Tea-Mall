import Link from "next/link";
import { Github } from "lucide-react"; // 🌟 깃허브 아이콘 (Lucide 아이콘 사용 시)

function Footer() {
  return (
    <footer className="w-full border-t bg-white py-4">
      <div className="flex flex-col">
        <div className="w-full border-b">
          <div className="flex gap-6 px-4 sm:px-8 pb-3 max-w-7xl mx-auto">
            <Link
              href="/policy/terms"
              className="hover:underline text-sm text-gray-600 font-medium"
            >
              이용약관
            </Link>
            <Link
              href="/policy/privacy"
              className="hover:underline text-sm text-gray-800"
            >
              개인정보처리방침
            </Link>
            <Link
              href="/inquiry"
              className="hover:underline text-sm text-gray-600"
            >
              고객센터
            </Link>
          </div>
        </div>

        <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row justify-between items-start text-xs sm:text-sm text-gray-500 gap-6 px-4 sm:px-8 py-6">
          <div className="space-y-2">
            <p className="font-bold text-base text-gray-800">T-Mall</p>
            <p className="text-gray-400 text-xs">
              스타일을 완성하는 당신의 패션 파트너
            </p>

            <div className="pt-2 space-y-1 text-gray-500 text-xs leading-relaxed">
              <p>
                상호명: T-Mall | 대표자: 정준영 | 사업자등록번호: 000-00-00000 |
                주소: 대한민국
              </p>
              <p className="text-gray-400 pt-1">
                ※ 본 사이트는 실제가 아닌 개인 학습용 및 포트폴리오 용도로
                제작된 가상 프로젝트입니다.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between md:items-end text-left md:text-right w-full md:w-auto md:self-stretch pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 gap-4">
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">
                Repository
              </p>
              <a
                href="https://github.com/DayTeaJun"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 hover:text-black transition-colors"
              >
                <Github size={16} />
                <span>GitHub</span>
              </a>
            </div>

            <div className="text-xs text-gray-400 pt-2">
              <p>
                &copy; {new Date().getFullYear()} T-Mall. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
