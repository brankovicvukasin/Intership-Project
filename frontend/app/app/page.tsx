"use client";
import IntroComponent from "@/app/app/_components/IntroComponent";
import IntroComponent2 from "./_components/IntroComponent2";
import ChartCrawlingsUpDown from "@/app/app/_components/ChartCrawlingsUpDown";
import { useState } from "react";

export default function AppPage() {
  const [timeRange, setTimeRange] = useState<number>(7);

  return (
    <div className="flex flex-col justify-start items-stretch h-screen max-h-screen p-4 gap-4">
      <IntroComponent timeRange={timeRange} setTimeRange={setTimeRange} />
      <IntroComponent2 timeRange={timeRange} setTimeRange={setTimeRange} />
      <div className="flex justify-center items-center w-full h-full p-4">
        <ChartCrawlingsUpDown />
      </div>
    </div>
  );
}
