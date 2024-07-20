"use client";

import { useState, useEffect } from "react";
import { getOneAnalysis } from "@/services/keywordsService";
import BarChart from "@/components/BarChart";
import LoadingIndicator from "@/components/Loading";
import { DialogKeywordsNotFound } from "@/app/app/_components/DialogKeywordsNotFound";

interface KeywordData {
  keyword: string;
  value: number;
  _id: string;
}

interface AnalysisData {
  analysisName: string;
  analysisUrl: string;
  searchedKeywords: string[];
  foundKeywords: KeywordData[];
  notFoundKeywords: string[];
  _id: string;
  analysisDate: string;
}

export default function Analysis({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  useEffect(() => {
    setLoading(true);
    getOneAnalysis(params.id)
      .then((data) => {
        setAnalysis(data.analysis);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!analysis) {
    return <LoadingIndicator />;
  }

  const formattedDate = new Date(analysis.analysisDate).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  return (
    <div className="relative flex justify-center min-h-screen w-full bg-white overflow-hidden">
      <div className="relative w-full max-w-screen-xl mx-auto text-center overflow-y-auto px-4">
        <div className=" text-left w-full">
          <>
            <div className="mt-4 flex flex-col items-end gap-4 p-2 rounded-xl">
              <div className="flex gap-4 justify-center items-center">
                <h2 className="text-base text-left font-medium text-gray-700">
                  <span className="pl-4 text-green-600">{formattedDate}</span>
                </h2>
                <DialogKeywordsNotFound
                  notFoundKeywords={analysis.notFoundKeywords}
                  url={analysis.analysisUrl}
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-700">
              Keywords Found:
            </h2>

            {analysis.foundKeywords.length > 0 && (
              <ul className="mt-2 text-gray-600 flex gap-2 flex-wrap justify-center sm:justify-stretch text-sm">
                {analysis.foundKeywords.map((keywordObj, index) => (
                  <li
                    key={index}
                    className="bg-blue-100 p-2 rounded-md cursor-pointer"
                  >
                    {keywordObj.keyword}: {keywordObj.value}
                  </li>
                ))}
              </ul>
            )}

            {analysis.foundKeywords.length > 0 && (
              <div className=" mt-10 mb-20 overflow-x-auto">
                <div className="min-w-[500px]">
                  <BarChart keywords={analysis.foundKeywords} />
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
