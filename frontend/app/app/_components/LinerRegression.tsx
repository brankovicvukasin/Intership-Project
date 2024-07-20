import React from "react";
import { Chart } from "react-google-charts";
import * as ss from "simple-statistics";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

interface LinearRegressionProps {
  data: AnalysisData[];
  selectedKeywords: Option[];
}

export const LinearRegression: React.FC<LinearRegressionProps> = ({
  data,
  selectedKeywords,
}) => {
  const transformDataForKeyword = (keyword: string) => {
    return data.map((entry, index) => {
      const foundKeyword = entry.foundKeywords.find(
        (kw) => kw.keyword === keyword
      );
      return [index, foundKeyword ? foundKeyword.value : 0];
    });
  };

  const performLinearRegression = (keywordData: number[][]) => {
    const regression = ss.linearRegression(keywordData);
    const regressionLine = ss.linearRegressionLine(regression);
    const regressionData = keywordData.map((point) => [
      point[0],
      regressionLine(point[0]),
    ]);
    return regressionData;
  };

  const preparedData = selectedKeywords.map((keyword) => {
    const keywordData = transformDataForKeyword(keyword.label);
    const regressionData = performLinearRegression(keywordData);
    return { keyword, regressionData };
  });

  const chartData: (string | number)[][] = [
    [
      "Time",
      ...selectedKeywords.map((keyword) => `${keyword.label} Regression`),
    ],
  ];

  for (let i = 0; i < data.length; i++) {
    const row: (string | number)[] = [i];
    selectedKeywords.forEach(({ label }, index) => {
      row.push(preparedData[index].regressionData[i][1]);
    });
    chartData.push(row);
  }

  return (
    <Dialog>
      <DialogTrigger>
        <div className="mb-4 p-2 rounded-md w-fit hover:bg-blue-100 hover:cursor-pointer">
          Linear Regression
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[1000px] bg-white">
        <DialogHeader>
          <DialogTitle>Linear Regression</DialogTitle>
          <DialogDescription>Linear Regression Chart</DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <Chart
            chartType="LineChart"
            data={chartData}
            options={{
              title: "Linear Regression",
              hAxis: { title: "Time" },
              vAxis: { title: "Value", minValue: 0 },
              series: {
                0: { color: "#e2431e" },
                1: { color: "#e7711b" },
                2: { color: "#f1ca3a" },
                3: { color: "#6f9654" },
                4: { color: "#1c91c0" },
                5: { color: "#43459d" },
              },
            }}
            width="100%"
            height="500px"
            legendToggle
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
