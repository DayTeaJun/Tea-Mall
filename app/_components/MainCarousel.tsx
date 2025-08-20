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
    }, 5000);

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
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover grayscale-50"
            priority={i === 0}
          />
        </div>
      ))}

      <button
        onClick={handlePrev}
        aria-label="이전 배너"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10  rounded-full flex items-center justify-center group cursor-pointer"
      >
        <span className="absolute inset-0 bg-black rounded-full opacity-20 z-[-1] group-hover:opacity-90"></span>
        <span className="text-white z-10">{"<"}</span>
      </button>

      <button
        onClick={handleNext}
        aria-label="다음 배너"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center group cursor-pointer"
      >
        <span className="absolute inset-0 bg-black rounded-full opacity-20 group-hover:opacity-90 z-[-1]"></span>
        <span className="text-white z-10">{">"}</span>
      </button>
    </div>
  );
}
