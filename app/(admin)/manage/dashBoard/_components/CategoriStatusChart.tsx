"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  LegendItem,
  TooltipItem,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryPieChart() {
  const labels = ["의류", "전자기기", "뷰티", "식품"];
  const categorySales = [450000, 300000, 150000, 80000];
  const totalSum = categorySales.reduce((a, b) => a + b, 0);

  const data: ChartData<"doughnut"> = {
    labels,
    datasets: [
      {
        data: categorySales,
        backgroundColor: ["#333333", "#666666", "#999999", "#cccccc"],
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 4,
        hoverBackgroundColor: ["#444444", "#777777", "#aaaaaa", "#dddddd"],
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20,
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 },
          generateLabels: (chart): LegendItem[] => {
            const chartData = chart.data;
            if (chartData.labels?.length && chartData.datasets.length) {
              return chartData.labels.map((label, i): LegendItem => {
                const dataset = chartData.datasets[0];
                const value = dataset.data[i] as number;
                const percentage = ((value / totalSum) * 100).toFixed(1);

                return {
                  text: `${label} ${percentage}%`,
                  fillStyle: (dataset.backgroundColor as string[])[i],
                  strokeStyle: dataset.borderColor as string,
                  lineWidth: dataset.borderWidth as number,
                  pointStyle: "circle",
                  index: i,
                  hidden: !chart.isDatasetVisible(0), // 범례 클릭 시 토글 상태 반영
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"doughnut">) => {
            const label = context.label || "";
            const value = context.raw as number;
            const percentage = ((value / totalSum) * 100).toFixed(1);
            return ` ${label}: ${value.toLocaleString()}원 (${percentage}%)`;
          },
        },
      },
    },
    cutout: "75%",
  };

  return (
    <div className="max-w-full bg-white p-4 flex flex-col gap-2 rounded">
      <p className="text-16 font-bold">카테고리별 판매 비율</p>

      <div className="p-2 pt-4 h-full">
        <div className="w-full h-[300px]">
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
