import React from "react";
import { Bar } from "react-chartjs-2";
import * as ss from "simple-statistics";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

interface Option {
  value: string;
  label: string;
}

interface Keyword {
  keyword: string;
  value: number;
}

interface AnalysisData {
  _id: string;
  foundKeywords: Keyword[];
  analysisDate: string;
  __v: number;
}

interface Props {
  selectedKeywords: Option[];
  data: AnalysisData[];
}

export const Mean: React.FC<Props> = ({ selectedKeywords, data }) => {
  const calculateMeanFrequencies = (
    data: AnalysisData[],
    selectedKeywords: Option[]
  ) => {
    const keywordMeans: { label: string; mean: number }[] = [];

    selectedKeywords.forEach((keyword) => {
      const values: number[] = [];

      data.forEach((analysis) => {
        const foundKeyword = analysis.foundKeywords.find(
          (k) => k.keyword === keyword.label
        );
        if (foundKeyword) {
          values.push(foundKeyword.value);
        }
      });

      if (values.length > 0) {
        keywordMeans.push({ label: keyword.label, mean: ss.mean(values) });
      }
    });

    keywordMeans.sort((a, b) => b.mean - a.mean);
    return keywordMeans;
  };

  const keywordMeans = calculateMeanFrequencies(data, selectedKeywords);

  const chartData = {
    labels: keywordMeans.map((item) => item.label),
    datasets: [
      {
        label: "Average Frequency",
        data: keywordMeans.map((item) => item.mean),
        backgroundColor: keywordMeans.map(
          (_, index) => `hsl(${(index * 360) / keywordMeans.length}, 70%, 50%)`
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Average Keyword Frequencies",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Keyword",
        },
      },
      y: {
        title: {
          display: true,
          text: "Average Frequency",
        },
      },
    },
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="mb-4 p-2 rounded-md w-fit hover:bg-blue-100 hover:cursor-pointer">
          Mean Analysis
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[1000px] bg-white">
        <DialogHeader>
          <DialogTitle>Mean Analysis</DialogTitle>
          <DialogDescription>Mean Analysis Chart</DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <Bar data={chartData} options={options} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
