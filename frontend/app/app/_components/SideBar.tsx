"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoStatsChartSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/appContext";
import { DialogKeywords } from "./DialogKeywords";
import { DialogAdminPanel } from "./DialogAdminPanel";
import { Button } from "@/components/ui/button";
import { logout } from "@/services/authenticationService";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllAnalysisNames } from "@/services/keywordsService";
import { inter500 } from "@/app/fonts";
import { DialogAreYouSure } from "./DialogAreYouSure";
import { getRole } from "@/services/keywordsService";
import { MdOutlineStackedLineChart } from "react-icons/md";
import { AiOutlineLineChart } from "react-icons/ai";
import { LuBarChart2 } from "react-icons/lu";

import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";

interface AnalysisData {
  id: string;
  analysisName: string;
  analysisDate: string;
}

export default function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen, sidebarChanged } = useAppContext();
  const [fetchedAnalysisNames, setFetchedAnalysisNames] = useState<
    AnalysisData[]
  >([]);
  const [role, setRole] = useState<string>("user");

  const pathname = usePathname();

  useEffect(() => {
    const getAnalysis = async () => {
      try {
        const result = await getAllAnalysisNames();
        const result2 = await getRole();
        setRole(result2.data);
        setFetchedAnalysisNames(result.analysisData);
      } catch (error) {
        console.error("Error fetching default keywords:", error);
      }
    };

    getAnalysis();
  }, [sidebarChanged]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      window.location.reload();
    } catch (error) {
      toast.error("Failed to Logout!");
      console.error("Failed to logout:", error);
    }
  };

  return (
    <>
      <button
        className={`p-2 fixed bottom-4  left-[10px] transform -translate-x-1/2 bg-gray-100 dark:bg-gray-800 rounded-md shadow-md z-50 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <FaArrowLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        ) : (
          <FaArrowRight className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      <div
        className={`${
          inter500.className
        }transform transition-transform duration-300 ease-in-out pt-5 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-slate-50 border-r border-gray-200 dark:border-gray-700 w-64 fixed z-40 overflow-y-auto h-screen flex flex-col`}
      >
        <div className="mx-4">
          <Link
            className="mb-4 ml-4 flex items-center gap-2 font-semibold text-lg"
            href="/app"
          >
            <IoStatsChartSharp className="h-6 w-6 text-green-500" />
            <span className="pt-1 ">BoardsAnalysis</span>
          </Link>
          <div className="my-4 w-full">
            <DialogKeywords />
          </div>
        </div>

        <Link
          href="/app/demandAnalysis"
          className={`flex justify-center gap-2 ${
            pathname === `/app/demandAnalysis`
              ? "bg-gradient-to-r from-blue-500 to-teal-400 hover:bg-blue-600 text-white"
              : "hover:bg-gradient-to-r from-blue-300 to-teal-200"
          }  hover:bg-blue-100 mx-4 p-2 text-start rounded-md text-black font-medium border mb-4`}
        >
          <span className="flex flex-col justify-center">
            <AiOutlineLineChart />{" "}
          </span>
          Demand Analysis
        </Link>

        <Link
          href="/app/supplyAnalysis"
          className={`flex justify-center gap-2  ${
            pathname === `/app/supplyAnalysis`
              ? "bg-gradient-to-r from-blue-500 to-teal-400 hover:bg-blue-600 text-white"
              : "hover:bg-gradient-to-r from-blue-300 to-teal-200"
          }  hover:bg-blue-100 mx-4 p-2  rounded-md text-black font-medium border mb-4`}
        >
          <span className="flex flex-col justify-center">
            <MdOutlineStackedLineChart />{" "}
          </span>
          Supply Analysis
        </Link>

        <Link
          href="/app/supplyDemand"
          className={`flex justify-center gap-2 ${
            pathname === `/app/supplyDemand`
              ? "bg-gradient-to-r from-blue-500 to-teal-400 hover:bg-blue-600 text-white"
              : "hover:bg-gradient-to-r from-blue-300 to-teal-200"
          }  hover:bg-blue-100 mx-4 p-2  rounded-md text-black font-medium border mb-4`}
        >
          <span className="flex flex-col justify-center">
            <LuBarChart2 />{" "}
          </span>
          Supply/Demand
        </Link>

        <h4 className="mb-4 mt-2 text-lg font-medium leading-none text-center border-b-2 pb-4 mx-4 border-blue-200">
          Analysis History
        </h4>

        <ScrollArea className="flex-grow  mb-4" type="hover">
          <div className="mx-4 text-center">
            {fetchedAnalysisNames.map((name) => (
              <Link key={name.id} href={`/app/${name.id}`}>
                <div
                  className={`flex text-center justify-between items-center text-sm  w-full p-2 my-1 rounded-md group ${
                    pathname === `/app/${name.id}`
                      ? "bg-gradient-to-r from-blue-300 to-blue-400 text-white"
                      : "hover:bg-gradient-to-r from-blue-50 to-blue-200"
                  }`}
                >
                  <span className="flex-grow text-center">
                    {name.analysisName}
                  </span>
                  <span className="ml-2 opacity-0 group-hover:opacity-100 text-blue-500">
                    <DialogAreYouSure
                      analysisName={name.analysisName}
                      analysisId={name.id}
                      setFetchedAnalysisNames={setFetchedAnalysisNames}
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>

        <div className="mx-4 mb-4">
          {role === "admin" && (
            <div className="my-4 w-full">
              <DialogAdminPanel />
            </div>
          )}

          <Button
            className="w-full text-black bg-white border hover:bg-blue-100 font-medium"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}
