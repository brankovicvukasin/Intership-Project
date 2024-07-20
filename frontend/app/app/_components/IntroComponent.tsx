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
import { useEffect, useState } from "react";
import {
  getTopTechnologies,
  getUpDownDemandTrend,
} from "@/services/keywordsService";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TopKeyword {
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

export default function IntroComponent({ timeRange, setTimeRange }: Props) {
  const [topTechnology, setTopTechnology] = useState<TopKeyword | null>(null);
  const [highestRisingTechnology, setHighestRisingTechnology] =
    useState<Trend | null>(null);
  const [lowestRisingTechnology, setLowestRisingTechnology] =
    useState<Trend | null>(null);

  useEffect(() => {
    const getTopTechnolgy = async () => {
      try {
        const result = await getTopTechnologies(timeRange);
        setTopTechnology(result.topKeyword);
      } catch (error) {
        console.error("Error fetching default keywords:", error);
        toast.error("There was an error!");
      }
    };

    getTopTechnolgy();
  }, [timeRange]);

  useEffect(() => {
    const getTrends = async () => {
      try {
        const result = await getUpDownDemandTrend(timeRange);
        setHighestRisingTechnology(result.data.highestRisingKeyword);
        setLowestRisingTechnology(result.data.lowestRisingKeyword);
      } catch (error) {
        console.error("Error fetching default keywords:", error);
        toast.error("There was an error!");
      }
    };

    getTrends();
  }, [timeRange]);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(Number(value));
  };

  return (
    <div className="flex flex-1 flex-wrap md:flex-nowrap mt-4 gap-4 mx-10 justify-around h-fit">
      <Card className="basis-1/3 grow w-20 min-h-52 h-fit">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Top Demanding </CardTitle>
            <Select onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-[180px] outline-none ring-0">
                <SelectValue placeholder="Last 7 Days" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Time</SelectLabel>
                  <SelectItem value="1">Last 24 hours</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="180">Last 6 months</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <CardDescription>Technology that is wanted most</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          {topTechnology ? (
            <div className="text-4xl font-bold"> {topTechnology.keyword}</div>
          ) : (
            <div className="text-4xl font-bold">Loading...</div>
          )}
        </CardContent>
        <CardDescription className="pl-6">
          Currently wanted:
          {topTechnology && (
            <span className="text-blue-500 font-medium pl-2">
              {topTechnology.value}{" "}
            </span>
          )}
        </CardDescription>
      </Card>

      <Card className="basis-1/3 grow min-w-72 min-h-52 h-fit">
        <CardHeader>
          <CardTitle>Rising Demanding</CardTitle>
          <CardDescription>Technology that is trending</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          {highestRisingTechnology ? (
            <div className="text-4xl font-bold">
              {" "}
              {highestRisingTechnology.keyword}
            </div>
          ) : (
            <div className="text-4xl font-bold">Loading...</div>
          )}
          <FiTrendingUp className="h-8 w-8 text-green-400" />
        </CardContent>
        <CardDescription className="pl-6">
          Trend:
          <span className="text-green-500 font-medium pl-2">
            +{highestRisingTechnology?.percentageChange}%
          </span>{" "}
        </CardDescription>
      </Card>

      <Card className="basis-1/3 grow min-w-72 min-h-52 h-fit">
        <CardHeader>
          <CardTitle>Down Demanding</CardTitle>
          <CardDescription>Technology that is trending down</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          {lowestRisingTechnology ? (
            <div className="text-4xl font-bold">
              {" "}
              {lowestRisingTechnology.keyword}
            </div>
          ) : (
            <div className="text-4xl font-bold">Loading...</div>
          )}
          <FiTrendingDown className="h-8 w-8 text-red-500" />
        </CardContent>
        <CardDescription className="pl-6">
          Trend:
          <span className="text-red-500 font-medium pl-2">
            {lowestRisingTechnology?.percentageChange}%
          </span>{" "}
        </CardDescription>
      </Card>
    </div>
  );
}
