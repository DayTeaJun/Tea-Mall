import Image from "next/image";
import Link from "next/link";

export default function MiddleBanner() {
  return (
    <div className="w-full my-4">
      <Link
        href="/products?event=special"
        className="relative block w-full h-[120px] sm:h-[160px] rounded-2xl overflow-hidden group cursor-pointer shadow-sm"
      >
        <Image
          src="/main_2.jpg"
          alt="기획전 이벤트 배너"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 text-white">
          <span className="text-xs sm:text-sm font-medium tracking-wider text-green-300 mb-1">
            SPECIAL EVENT
          </span>
          <h3 className="text-lg sm:text-2xl font-bold tracking-tight">
            2026 S/S 시즌 단독 특가 기획전
          </h3>
          <p className="text-xs sm:text-sm text-gray-200 mt-1">
            지금 가장 인기 있는 아이템을 최대 30% 할인된 가격으로 만나보세요
            &rarr;
          </p>
        </div>
      </Link>
    </div>
  );
}
