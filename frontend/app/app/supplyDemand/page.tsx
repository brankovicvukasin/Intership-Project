"use client";

import { useState, useEffect } from "react";
import {
  getLastDemandData,
  getLastSupplyData,
} from "@/services/keywordsService";
import BarChart from "@/components/BarChart";
import LoadingIndicator from "@/components/Loading";

interface Data {
  keyword: string;
  value: number;
  _id: string;
}

interface AnalysisData {
  foundKeywords: Data[];
  _id: string;
  analysisDate: string;
}

export default function SupplyDemandPage() {
  const [demandAnalysis, setDemandAnalysis] = useState<AnalysisData | null>(
    null
  );

  const [supplyAnalysis, setSupplyAnalysis] = useState<AnalysisData | null>(
    null
  );

  useEffect(() => {
    const getDemandSupplyAnalysis = async () => {
      try {
        const demand = await getLastDemandData();
        const supply = await getLastSupplyData();

        setDemandAnalysis(demand.data);
        setSupplyAnalysis(supply.data);
      } catch (error) {
        console.error("Error fetching default keywords:", error);
      }
    };

    getDemandSupplyAnalysis();
  }, []);

  if (!demandAnalysis || !supplyAnalysis) {
    return <LoadingIndicator />;
  }

  const formattedDate = new Date(demandAnalysis.analysisDate).toLocaleString(
    "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }
  );

  const generateTableData = () => {
    const tableData: {
      [key: string]: { demand: number | null; supply: number | null };
    } = {};

    demandAnalysis.foundKeywords.forEach((item) => {
      if (!tableData[item.keyword]) {
        tableData[item.keyword] = { demand: item.value, supply: null };
      } else {
        tableData[item.keyword].demand = item.value;
      }
    });

    supplyAnalysis.foundKeywords.forEach((item) => {
      if (!tableData[item.keyword]) {
        tableData[item.keyword] = { demand: null, supply: item.value };
      } else {
        tableData[item.keyword].supply = item.value;
      }
    });

    return tableData;
  };

  const tableData = generateTableData();

  return (
    <div className="relative flex justify-center min-h-screen w-full bg-white overflow-hidden">
      <div className="relative w-full max-w-screen-xl mx-auto text-center overflow-y-auto px-4">
        <div className="mt-2 text-left w-full">
          <>
            <div className="flex flex-col items-end gap-4 p-2 rounded-xl">
              <div className="flex gap-4 justify-center items-center">
                <h2 className="mt-2 text-base text-left font-medium text-gray-700">
                  <span className="pl-4 text-green-600">
                    Last scraping done: {formattedDate}
                  </span>
                </h2>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-700 mb-10">
              Demand Chart
            </h2>

            {demandAnalysis.foundKeywords.length > 0 && (
              <div className="mt-2 mb-10 overflow-x-auto">
                <div className="min-w-[500px]">
                  <BarChart keywords={demandAnalysis.foundKeywords} />
                </div>
              </div>
            )}

            <h2 className="text-2xl font-semibold text-gray-700 mb-10">
              Supply Chart
            </h2>

            {demandAnalysis.foundKeywords.length > 0 && (
              <div className="mt-2 mb-20 overflow-x-auto">
                <div className="min-w-[500px]">
                  <BarChart keywords={supplyAnalysis.foundKeywords} />
                </div>
              </div>
            )}

            <h2 className="text-2xl font-semibold text-gray-700 mb-10">
              Supply and Demand Table
            </h2>

            <div className="overflow-x-auto mb-40 py-4 flex justify-stretch">
              <table className="min-w-full divide-y divide-gray-200  rounded-xl shadow-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-50 "
                    >
                      Technology
                    </th>
                    {Object.keys(tableData).map((keyword) => (
                      <th
                        key={keyword}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50"
                      >
                        {keyword}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white ">
                      Demand
                    </td>
                    {Object.keys(tableData).map((keyword) => (
                      <td key={keyword} className="px-6 py-4 whitespace-nowrap">
                        {tableData[keyword].demand !== null
                          ? tableData[keyword].demand
                          : "N/A"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white">
                      Supply
                    </td>
                    {Object.keys(tableData).map((keyword) => (
                      <td key={keyword} className="px-6 py-4 whitespace-nowrap">
                        {tableData[keyword].supply !== null
                          ? tableData[keyword].supply
                          : "N/A"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        </div>
      </div>
    </div>
  );
}
