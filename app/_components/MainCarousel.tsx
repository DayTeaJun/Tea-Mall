"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/main_1.jpg",
    title: "2026 S/S NEW ARRIVAL",
    subtitle: "이번 시즌 새로 만나는 신상품을 지금 확인해보세요",
    href: "/search?sort=latest&page=1",
  },
  {
    src: "/main_3.jpg",
    title: "시즌 오프 특가",
    subtitle: "인기 상품을 특별한 가격에 만나보는 기회",
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
        {slides.map((slide, i) => (
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

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute left-4 sm:left-8 bottom-6 sm:bottom-10 z-10 text-white max-w-[80%]">
              <h3 className="text-base sm:text-3xl font-bold tracking-tight">
                {slide.title}
              </h3>
              <p className="text-xs sm:text-base text-white/80 mt-1 sm:mt-2">
                {slide.subtitle}
              </p>
            </div>
          </Link>
        ))}
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
