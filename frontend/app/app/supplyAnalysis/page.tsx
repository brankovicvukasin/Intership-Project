"use client";

import { useEffect, useState } from "react";
import { getAllSupply } from "@/services/keywordsService";
import toast from "react-hot-toast";
import { Chart } from "react-google-charts";
import Select from "react-select";
import LoadingIndicator from "@/components/Loading";
import { format, addHours } from "date-fns";
import { getAllSupplyTechnologies } from "@/services/keywordsService";
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

const timeRangeOptions: Option[] = [
  { value: "1", label: "Last 24 hours" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "180", label: "Last 6 months" },
  { value: "365", label: "Last year" },
];

export default function DemandAnalysisPage() {
  const [defaultAnalysis, setDefaultAnalysis] = useState<AnalysisData[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<Option[]>([]);
  const [timeRange, setTimeRange] = useState<number>(7);
  const [keywordOptions, setKeywordOptions] = useState<Option[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    const getTechnologies = async () => {
      try {
        const result = await getAllSupplyTechnologies();
        const options = result.data.map((technology: Keyword) => ({
          value: technology.keyword.toLowerCase(),
          label: technology.keyword,
        }));
        setKeywordOptions(options);
      } catch (error) {
        console.error("Error fetching keywords:", error);
        toast.error("There was an error!");
      }
    };

    getTechnologies();
  }, []);

  useEffect(() => {
    const getAnalysis = async () => {
      try {
        const result = await getAllSupply(timeRange, selectedKeywords);
        setDefaultAnalysis(result.data);
        setDataLoaded(true);
        processChartData(result.data, selectedKeywords, timeRange);
      } catch (error) {
        console.error("Error fetching default keywords:", error);
        toast.error("There was an error!");
      }
    };

    getAnalysis();
  }, [timeRange, selectedKeywords]);

  useEffect(() => {
    processChartData(defaultAnalysis, selectedKeywords, timeRange);
  }, [selectedKeywords]);

  const processChartData = (
    data: AnalysisData[],
    selectedKeywords: Option[],
    timeRange: number
  ) => {
    const now = new Date();
    const startTime = new Date(now.getTime() - timeRange * 24 * 60 * 60 * 1000); // Calculate start time
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
    backgroundColor: "#FFFFFF",
    chartArea: { backgroundColor: "#FFFFFF" },
  };

  return (
    <div className="flex flex-col justify-start items-center w-full min-h-screen bg-white">
      <div className="flex w-full justify-center items-center gap-4 mt-16">
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
            dataDeviation={chartData}
            selectedKeywords={selectedKeywords}
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

      {chartData.length > 1 && selectedKeywords.length > 0 ? (
        <Chart
          chartType="LineChart"
          width="100%"
          height="700px"
          data={chartData}
          options={options}
        />
      ) : dataLoaded ? (
        <div>NO DATA</div>
      ) : (
        <LoadingIndicator />
      )}
    </div>
  );
}
