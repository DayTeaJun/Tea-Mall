"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/main_1.jpg",
    align: "left" as const,
    title: "2026 S/S NEW ARRIVAL",
    subtitle: "이번 시즌 새로 만나는 신상품을 지금 확인해보세요",
    href: "/search?sort=latest&page=1",
  },
  {
    src: "/main_3.jpg",
    align: "center" as const,
    eyebrow: "지금이 가장 특별한 순간",
    title: "전 품목 10% 쿠폰팩",
    subtitle: "기간 한정 · 2026.04.30까지 · SS26SPEC",
    cta: "쿠폰 받으러 가기",
    href: "/events",
  },
];

export default function MainCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearTimeout(timer);
  }, [index]);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[200px] sm:h-[400px] overflow-hidden sm:mt-4">
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => {
          const isCenter = slide.align === "center";

          return (
            <Link
              key={slide.href}
              href={slide.href}
              className="relative w-full h-full shrink-0"
            >
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                className="object-cover"
                priority={i === 0}
              />

              <div
                className={`absolute inset-0 ${
                  isCenter
                    ? "bg-black/50"
                    : "bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                }`}
              />

              <div
                className={`absolute z-10 text-white ${
                  isCenter
                    ? "inset-0 flex flex-col items-center justify-center text-center px-4"
                    : "left-4 sm:left-8 bottom-6 sm:bottom-10 max-w-[80%]"
                }`}
              >
                {"eyebrow" in slide && (
                  <p className="text-[10px] sm:text-sm tracking-wide text-white/80 mb-1">
                    {slide.eyebrow}
                  </p>
                )}
                <h3
                  className={
                    isCenter
                      ? "text-2xl sm:text-5xl font-extrabold tracking-tight"
                      : "text-base sm:text-3xl font-bold tracking-tight"
                  }
                >
                  {slide.title}
                </h3>
                <p className="text-xs sm:text-base text-white/80 mt-1 sm:mt-2">
                  {slide.subtitle}
                </p>
                {"cta" in slide && (
                  <span className="inline-flex items-center gap-1 mt-3 sm:mt-5 text-xs sm:text-sm font-semibold text-white underline underline-offset-4">
                    {slide.cta} &rarr;
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-3 bg-black/40 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-full text-xs font-medium">
        <button
          onClick={handlePrev}
          aria-label="이전 배너"
          className="hover:text-gray-300 transition-colors cursor-pointer"
        >
          &lt;
        </button>
        <span className="tracking-wider">
          {index + 1} / {slides.length}
        </span>
        <button
          onClick={handleNext}
          aria-label="다음 배너"
          className="hover:text-gray-300 transition-colors cursor-pointer"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
