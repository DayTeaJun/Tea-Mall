"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
  { src: "/main_1.jpg", alt: "이벤트 배너 1" },
  { src: "/main_2.jpg", alt: "이벤트 배너 2" },
  { src: "/main_3.jpg", alt: "이벤트 배너 3" },
];

export default function MainCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full h-[200px] sm:h-[400px] overflow-hidden sm:mt-4">
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((img, i) => (
          <div key={i} className="relative w-full h-full shrink-0">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              priority={i === 0}
            />
          </div>
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
          {index + 1} / {images.length}
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
