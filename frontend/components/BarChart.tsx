"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  keywords: { keyword: string; value: number }[];
}

const getColor = (index: number) => {
  const colors = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)",
    "rgba(199, 199, 199, 0.6)",
    "rgba(123, 239, 178, 0.6)",
    "rgba(255, 223, 186, 0.6)",
    "rgba(255, 105, 180, 0.6)",
    "rgba(144, 238, 144, 0.6)",
    "rgba(173, 216, 230, 0.6)",
    "rgba(250, 128, 114, 0.6)",
    "rgba(221, 160, 221, 0.6)",
  ];
  return colors[index % colors.length];
};

const BarChart: React.FC<BarChartProps> = ({ keywords }) => {
  const data = {
    labels: keywords.map((k) => k.keyword),
    datasets: [
      {
        label: "Technologies Frequency",
        data: keywords.map((k) => k.value),
        backgroundColor: keywords.map((_, index) => getColor(index)),
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
