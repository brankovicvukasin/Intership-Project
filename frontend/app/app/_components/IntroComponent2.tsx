"use client";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { FiTrendingUp } from "react-icons/fi";
import { FiTrendingDown } from "react-icons/fi";
import { getTopSupply, getUpDownSupplyTrend } from "@/services/keywordsService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface TopSupply {
  keyword: string;
  value: number;
}

interface Trend {
  keyword: string;
  percentageChange: number;
  trend: number;
}
interface Props {
  timeRange: number;
  setTimeRange: any;
}

export default function IntroComponent2({ timeRange, setTimeRange }: Props) {
  const [topSupply, setTopSupplyy] = useState<TopSupply | null>(null);
  const [highestRisingSupply, setHighestRisingTechnology] =
    useState<Trend | null>(null);
  const [lowestRisingSupply, setLowestRisingTechnology] =
    useState<Trend | null>(null);

  useEffect(() => {
    const getTopSupplies = async () => {
      try {
        const result = await getTopSupply();
        setTopSupplyy(result.topSupply);
      } catch (error) {
        console.error("Error fetching supply:", error);
        toast.error("There was an error!");
      }
    };

    getTopSupplies();
  }, [timeRange]);

  useEffect(() => {
    const getTrends = async () => {
      try {
        const result = await getUpDownSupplyTrend(timeRange);

        setHighestRisingTechnology(result.data.highestRisingKeyword);
        setLowestRisingTechnology(result.data.lowestRisingKeyword);
      } catch (error) {
        console.error("Error fetching default keywords:", error);
        toast.error("There was an error!");
      }
    };

    getTrends();
  }, [timeRange]);

  return (
    <div className="flex flex-1 flex-wrap md:flex-nowrap mt-4 gap-4 mx-10 justify-stretch h-fit">
      <Card className="basis-1/3 grow min-w-72 min-h-52 h-fit">
        <CardHeader>
          <CardTitle>Top Supply</CardTitle>
          <CardDescription>Technology that is supplied most</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          {topSupply ? (
            <div className="text-4xl font-bold"> {topSupply.keyword}</div>
          ) : (
            <div className="text-4xl font-bold">Loading...</div>
          )}
        </CardContent>
        <CardDescription className="pl-6">
          Currently supplied:
          {topSupply && (
            <span className="text-blue-500 font-medium pl-2">
              {topSupply.value}{" "}
            </span>
          )}
        </CardDescription>
      </Card>

      <Card className="basis-1/3 grow min-w-72 min-h-52 h-fit">
        <CardHeader>
          <CardTitle>Rising Supply</CardTitle>
          <CardDescription>Technology which supply is trending</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          {highestRisingSupply ? (
            <div className="text-4xl font-bold">
              {" "}
              {highestRisingSupply.keyword}
            </div>
          ) : (
            <div className="text-4xl font-bold">Loading...</div>
          )}
          <FiTrendingUp className="h-8 w-8 text-green-400" />
        </CardContent>
        <CardDescription className="pl-6">
          Currently supplied:
          <span className="text-green-500 font-medium pl-2">
            +{highestRisingSupply?.percentageChange}%
          </span>
        </CardDescription>
      </Card>

      <Card className="basis-1/3 grow min-w-72 min-h-52 h-fit">
        <CardHeader>
          <CardTitle>Down Supply</CardTitle>
          <CardDescription>Technology which supply is down</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          {lowestRisingSupply ? (
            <div className="text-4xl font-bold">
              {" "}
              {lowestRisingSupply.keyword}
            </div>
          ) : (
            <div className="text-4xl font-bold">Loading...</div>
          )}
          <FiTrendingDown className="h-8 w-8 text-red-500" />
        </CardContent>
        <CardDescription className="pl-6">
          Currently supplied:
          <span className="text-red-500 font-medium pl-2">
            {" "}
            {lowestRisingSupply?.percentageChange}%
          </span>
        </CardDescription>
      </Card>
    </div>
  );
}
