import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// D-Day 계산 함수
export const calculateDday = (expiresAt: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiryDate = new Date(expiresAt);
  expiryDate.setHours(0, 0, 0, 0);

  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "D-DAY";
  if (diffDays < 0) return "기간만료";
  return `D-${diffDays}`;
};

// 날짜 문자열에서 연도를 제외한 월/일 형식으로 변환하는 함수
export const formatWithoutYear = (dateString: string) => {
  const parts = new Date(dateString)
    .toLocaleDateString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\s/g, "");
  return parts;
};
