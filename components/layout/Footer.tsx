import React from "react";

function Footer() {
  return (
    <footer className="fixed bottom-0 w-full border-t bg-white py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 gap-4">
        <div className="text-center md:text-left">
          <p className="font-semibold text-lg text-gray-800">Tea Mall</p>
          <p className="text-xs mt-1">당신의 하루를 따뜻하게, 티몰과 함께</p>
        </div>

        <div className="flex gap-6">
          <a href="/about" className="hover:underline">
            회사소개
          </a>
          <a href="/policy" className="hover:underline">
            이용약관
          </a>
          <a href="/privacy" className="hover:underline">
            개인정보처리방침
          </a>
          <a href="/contact" className="hover:underline">
            고객센터
          </a>
        </div>

        <div className="text-xs text-gray-500 text-center md:text-right">
          <p>
            &copy; {new Date().getFullYear()} Tea Mall. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
