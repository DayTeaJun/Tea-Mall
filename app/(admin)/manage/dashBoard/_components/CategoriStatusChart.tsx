"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryPieChart() {
  const labels = ["의류", "전자기기", "뷰티", "식품"];
  const categorySales = [450000, 300000, 150000, 80000];

  const totalSum = categorySales.reduce((a, b) => a + b, 0);

  const data = {
    labels,
    datasets: [
      {
        data: categorySales,
        backgroundColor: ["#333333", "#666666", "#999999", "#cccccc"],
        borderWidth: 1,
        borderColor: "#ffffff",
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 30,
          font: { size: 12 },
          generateLabels: (chart: any) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const value = data.datasets[0].data[i];
                const percentage = ((value / totalSum) * 100).toFixed(1); // 소수점 1자리
                return {
                  text: `${label} ${percentage}%`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor,
                  lineWidth: data.datasets[0].borderWidth,
                  pointStyle: "circle",
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.raw;
            const percentage = ((value / totalSum) * 100).toFixed(1);
            return ` ${label}: ${value.toLocaleString()}원 (${percentage}%)`;
          },
        },
      },
    },
    cutout: "80%",
  };

  return <Doughnut data={data} options={options} />;
}
