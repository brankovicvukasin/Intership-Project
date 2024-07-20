"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getCrawlingStats } from "@/services/keywordsService";
import toast from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DataPoint {
  _id: string;
  analysisDate: string;
}

export default function CrawlDataChart() {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const getAnalysis = async () => {
      try {
        const result = await getCrawlingStats();
        setData(result.analyses);
      } catch (error) {
        console.error("Error fetching default keywords:", error);
        toast.error("There was an error!");
      }
    };

    getAnalysis();
  }, []);

  const generateCrawlData = () => {
    const hoursArray = Array(24).fill(0);
    const labels = [];
    const now = new Date();

    for (let i = 0; i < 24; i++) {
      const date = new Date(now.getTime() - i * 60 * 60 * 1000);
      labels.unshift(
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );

      const hourStart = new Date(now.getTime() - (i + 1) * 60 * 60 * 1000);
      const hourEnd = new Date(now.getTime() - i * 60 * 60 * 1000);

      const isCrawlOn = data.some((item) => {
        const analysisDate = new Date(item.analysisDate);
        return analysisDate >= hourStart && analysisDate < hourEnd;
      });

      hoursArray[23 - i] = isCrawlOn ? 1 : 0;
    }

    return { labels, hoursArray };
  };

  const { labels, hoursArray } = generateCrawlData();

  const chartData = {
    labels,
    datasets: [
      {
        label: "Crawling Status For the Last 24h",
        data: hoursArray,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (tickValue: string | number) =>
            tickValue === 1 ? "Up" : "Down",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => (context.raw === 1 ? "On" : "Off"),
        },
      },
    },
  };

  return (
    <div
      className="w-full mx-6 p-4 border rounded-lg shadow-md"
      style={{ height: "400px" }}
    >
      <Line data={chartData} options={options} height={500} />
    </div>
  );
}
