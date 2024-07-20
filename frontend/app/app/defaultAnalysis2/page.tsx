"use client";

import { useEffect, useState } from "react";
import { getDefaultAnalysis } from "@/services/authenticationService";
import toast from "react-hot-toast";
import { Chart } from "react-google-charts";
import Select from "react-select";
import LoadingIndicator from "@/components/Loading";
import { subDays, format, addHours } from "date-fns";
import { getAllKeywords } from "@/services/keywordsService";
import { DropDownMenyAnalysis } from "@/app/app/_components/DropDownMenu";

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

interface Option {
  value: string;
  label: string;
}

const shown: Option[] = [
  { value: "aws", label: "AWS" },
  { value: "azure", label: "Azure" },
  { value: "java", label: "Java" },
];

const timeRangeOptions: Option[] = [
  { value: "1", label: "Last 24 hours" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "180", label: "Last 6 months" },
  { value: "365", label: "Last year" },
];

export default function DefaultAnalysis2() {
  const [defaultAnalysis, setDefaultAnalysis] = useState<AnalysisData[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<Option[]>(shown);
  const [lastSelectedKeyword, setLastSelectedKeyword] = useState<string>("");
  const [timeRange, setTimeRange] = useState<number>(1);
  const [keywordOptions, setKeywordOptions] = useState<Option[]>([]);

  useEffect(() => {
    const getKeywords = async () => {
      try {
        const result = await getAllKeywords();
        const options = result.data.map((keyword: string) => ({
          value: keyword.toLowerCase(),
          label: keyword,
        }));
        setKeywordOptions(options);
      } catch (error) {
        console.error("Error fetching keywords:", error);
        toast.error("There was an error!");
      }
    };

    getKeywords();
  }, []);

  useEffect(() => {
    const getAnalysis = async () => {
      try {
        const result = await getDefaultAnalysis(timeRange);
        setDefaultAnalysis(result.data);
        processChartData(result.data, selectedKeywords, timeRange);
      } catch (error) {
        console.error("Error fetching default keywords:", error);
        toast.error("There was an error!");
      }
    };

    getAnalysis();
  }, [timeRange]);

  useEffect(() => {
    processChartData(defaultAnalysis, selectedKeywords, timeRange);
    if (selectedKeywords.length > 0) {
      setLastSelectedKeyword(
        selectedKeywords[selectedKeywords.length - 1].value
      );
    }
  }, [selectedKeywords]);

  const processChartData = (
    data: AnalysisData[],
    selectedKeywords: Option[],
    timeRange: number
  ) => {
    const now = new Date();
    const startTime = subDays(now, timeRange);
    const hours = Array.from({ length: timeRange * 24 }, (_, i) =>
      format(addHours(startTime, i), "MM/dd HH:00")
    );

    const chartData: any[] = [
      ["Time", ...selectedKeywords.map((keyword) => keyword.label)],
    ];

    const dataMap = data.reduce((acc: Record<string, any>, item) => {
      const dateTime = format(new Date(item.analysisDate), "MM/dd HH:00");
      acc[dateTime] = acc[dateTime] || {};
      item.foundKeywords.forEach((keyword) => {
        acc[dateTime][keyword.keyword.toLowerCase()] = keyword.value;
      });
      return acc;
    }, {});

    hours.forEach((hour) => {
      const rowData: (string | number)[] = [hour];
      selectedKeywords.forEach((keyword) => {
        rowData.push(dataMap[hour]?.[keyword.value] || 0);
      });
      chartData.push(rowData);
    });

    setChartData(chartData);
  };

  const options = {
    title: "Keyword Analysis Over Time",
    curveType: "none" as const,
    responsive: true,
    legend: { position: "bottom" as const },
    hAxis: {
      title: "Time",
      format: "MM/dd HH:00",
      showTextEvery: Math.max(1, Math.floor(chartData.length / 5)),
    },
    vAxis: {
      title: "Value",
    },
    backgroundColor: "#F9FAFB",
    chartArea: { backgroundColor: "#F9FAFB" },
  };

  if (!defaultAnalysis.length) {
    return <LoadingIndicator />;
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full bg-gray-50">
      <div className="flex w-full justify-center items-center gap-4">
        <Select
          isMulti
          options={keywordOptions}
          value={selectedKeywords}
          onChange={(selected: any) => setSelectedKeywords(selected)}
          className="w-1/2 mb-4"
        />
        <div className="mb-4">
          {" "}
          <DropDownMenyAnalysis
            data={defaultAnalysis}
            lastSelectedKeyword={lastSelectedKeyword}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="mr-2">Select Period:</label>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="px-3 py-1 rounded-2xl border"
        >
          {timeRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {chartData.length > 1 && (
        <Chart
          chartType="LineChart"
          width="100%"
          height="700px"
          data={chartData}
          options={options}
        />
      )}
    </div>
  );
}
