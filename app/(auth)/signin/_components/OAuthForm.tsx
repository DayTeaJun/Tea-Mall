import Image from "next/image";
import React from "react";

const images = [{ src: "/kakao.png" }];

function OAuthForm() {
  return (
    <div className="flex flex-col gap-4 p-5 max-w-[500px] w-full font-bold text-[14px]">
      <button className="w-full py-2 rounded bg-red-500 text-white">
        구글 로그인
      </button>
      <button className="w-full py-2 rounded bg-yellow-500 text-black relative">
        카카오 로그인
        <div className="absolute top-1/2 -translate-y-1/2 left-2 w-5 h-5">
          <Image
            src={images[0].src}
            alt=""
            width={20}
            height={20}
            className="object-cover grayscale-50"
          />
        </div>
      </button>
      <button className="w-full py-2 rounded bg-green-500 text-white">
        네이버 로그인
      </button>
    </div>
  );
}

export default OAuthForm;
