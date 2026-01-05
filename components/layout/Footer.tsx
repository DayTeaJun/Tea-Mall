import Link from "next/link";

function Footer() {
  return (
    <footer className="w-full border-t bg-white py-3">
      <div className="flex flex-col">
        <div className="w-full border-b">
          <div className="flex gap-4 px-4 pb-3 max-w-7xl mx-auto">
            <Link
              href="/policy/terms"
              className="hover:underline text-sm text-gray-500 text-center"
            >
              이용약관
            </Link>

            <Link
              href="/policy/privacy"
              className="hover:underline text-sm text-gray-500 text-center"
            >
              개인정보 처리방침
            </Link>
          </div>
        </div>
        <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 gap-4 p-2 sm:py-6 sm:px-4">
          <div className="text-center md:text-left">
            <p className="font-semibold text-lg text-gray-800">T-Mall</p>
            <p className="text-xs mt-1">스타일을 완성하는 당신의 패션 파트너</p>
          </div>

          <div className="text-xs text-gray-500 text-center md:text-right mt-auto">
            <p>
              &copy; {new Date().getFullYear()} Tee Mall. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
