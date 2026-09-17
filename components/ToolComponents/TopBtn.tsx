"use client";

import { ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";

function TopBtn() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={() => window.scrollTo(0, 0)}
          type="button"
          className="p-3 bg-gray-200 rounded-full text-gray-500"
        >
          <ChevronUp size={25} strokeWidth="3px" />
        </button>
      )}
    </>
  );
}

export default TopBtn;
