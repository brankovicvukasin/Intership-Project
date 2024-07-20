import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  data: AnalysisData[];
  selectedKeywords: Option[];
}

export default function StandardDeviation({ selectedKeywords, data }: Props) {
  const computeDeviation = (current: number, previous: number) => {
    return current - previous;
  };

  const chartData = {
    labels: data.map((d) => new Date(d.analysisDate).toLocaleDateString()),
    datasets: selectedKeywords.map((keyword) => {
      const keywordValues = data.map((d) => {
        const foundKeyword = d.foundKeywords.find(
          (k) => k.keyword === keyword.label
        );
        return foundKeyword ? foundKeyword.value : 0;
      });

      const deviations = keywordValues.map((value, index) => {
        if (index === 0) return 0;
        return computeDeviation(value, keywordValues[index - 1]);
      });

      return {
        label: keyword.label,
        data: deviations,
        borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        fill: false,
      };
    }),
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="mb-4 p-2 rounded-md w-fit hover:bg-blue-100 hover:cursor-pointer">
          Standard Deviation
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[1000px] bg-white">
        <DialogHeader>
          <DialogTitle>Standard Deviation</DialogTitle>
          <DialogDescription>Standard Deviation Chart</DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <Line data={chartData} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
