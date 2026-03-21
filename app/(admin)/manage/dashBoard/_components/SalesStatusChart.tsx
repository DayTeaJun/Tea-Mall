"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
);

export default function SimpleLineChart() {
  const labels = ["3/10", "3/11", "3/12", "3/13", "3/14", "3/15", "3/16"];
  const mockSales = [150000, 230000, 180000, 290000, 200000, 350000, 410000];

  const data = {
    labels,
    datasets: [
      {
        data: mockSales,
        borderColor: "#000000", // 선 색상만 지정
        borderWidth: 1, // 선 두께
        tension: 0.3, // 0으로 설정하여 직선(꺾은선) 유지
        pointRadius: 1, // 점 제거
        pointHitRadius: 10, // 마우스 호버 인식 범위는 유지
        fill: true, // 채우기 없음
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        suggestedMax: 400000,
        grid: {
          color: "#f1f5f9",
        },
        ticks: {
          stepSize: 100000,
          callback: (value: any) => `${value.toLocaleString()}원`,
        },
      },
    },
  };

  return (
    <div className="w-[70%] bg-white p-4 flex flex-col gap-2 rounded">
      <p className="text-16 font-bold">주간 매출 추이</p>
      <div className="p-2 pt-4">
        <div className="w-full h-64">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
