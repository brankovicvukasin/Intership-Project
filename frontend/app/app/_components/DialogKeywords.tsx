"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/appContext";
import toast from "react-hot-toast";
import {
  addNewAnalysis,
  getDefaultKeywords,
  addDefaultKeywords,
  deleteDefaultKeywords,
} from "@/services/keywordsService";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export function DialogKeywords() {
  const {
    searchKeywords,
    setSearchKeywords,
    url,
    setUrl,
    setSidebarChanged,
    sidebarChanged,
  } = useAppContext();
  const [fetchedDefaultKeywords, setFetchedDefaultKeywords] = useState<
    string[]
  >([]);
  const [inputDefaultKeyword, setInputDefaultKeyword] = useState<string[]>([]);
  const [analysisName, setAnalysisName] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const defaultKeywords = await getDefaultKeywords();
        setFetchedDefaultKeywords(defaultKeywords.defaultKeywords);
      } catch (error) {
        console.error("Error fetching default keywords:", error);
      }
    };

    fetchKeywords();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputDefaultKeyword(value.split(" "));
  };

  const handleStartAnalysis = async () => {
    try {
      const result = await addNewAnalysis(searchKeywords, url, analysisName);
      setSidebarChanged(!sidebarChanged);
      router.push(`/app/${result.analysisId}`);
      toast.success("New Analysis Successfuly Added");
    } catch (error) {
      toast.error("There was an error with this Analysis");
      console.error("Failed to fetch keywords:", error);
    }
  };

  const handleAddDefaultKeyword = async () => {
    try {
      const result = await addDefaultKeywords(inputDefaultKeyword);
      setFetchedDefaultKeywords(result.defaultKeywords);
      toast.success("Default Keywords Successfuly Added!");
    } catch (error) {
      console.error("Error with adding keywords:", error);
      toast.error("There was an error with adding default keywords!");
    }
  };

  const handleDeleteDefaultKeyword = async () => {
    try {
      const result = await deleteDefaultKeywords(inputDefaultKeyword);
      setFetchedDefaultKeywords(result.defaultKeywords);
      toast.success("Default Keywords Successfuly Deleted!");
    } catch (error) {
      console.error("Error with deleting keywords:", error);
      toast.error("There was an error with deleting default keywords!");
    }
  };

  const handleAddAllDefaultKeywords = () => {
    setSearchKeywords(fetchedDefaultKeywords);
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        <Button
          variant="outline"
          className="font-semibold bg-green-500 hover:bg-green-400 hover:text-white text-white"
        >
          + Add New Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[300px] sm:max-w-[1200px] max-h-[900px] overflow-y-auto p-10 ">
        <DialogHeader>
          <DialogTitle>+ Add New Analysis</DialogTitle>
          <div className="flex  gap-6">
            <input
              type="text"
              className="p-2 mt-2 border rounded-md focus:outline-none focus:ring-blue-500 flex-grow min-w-[300px] w-full"
              placeholder="Enter Website URL..."
              onChange={(e) => setUrl(e.target.value)}
            />
            <Separator orientation="vertical" />
            <input
              type="text"
              className="p-2 mt-2 border rounded-md focus:outline-none focus:ring-blue-500 flex-grow min-w-[300px] w-full"
              placeholder="Enter Analysis Name..."
              onChange={(e) => setAnalysisName(e.target.value)}
            />
          </div>
        </DialogHeader>

        <DialogHeader>
          <DialogDescription>
            Ensure each keyword is separated by a space. To search for multiple
            keywords as a single phrase, enclose them in parentheses with + sign
            between them. If you use some keyword inside parentheses, don`t use
            same keyword outside of it.
          </DialogDescription>
          <DialogDescription>Example: (js+javascript)</DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 flex-wrap sm:flex-nowrap">
          <div className="border p-2 rounded-md bg-white overflow-y-auto h-72 w-full">
            <Label className="block mb-2 font-semibold">
              Default Keywords:
            </Label>
            <div className="flex flex-wrap gap-2">
              {fetchedDefaultKeywords.length > 0 &&
                fetchedDefaultKeywords.map((keyword, index) => (
                  <button
                    key={index}
                    className="py-1 px-2 bg-blue-100 rounded-md"
                    onClick={() =>
                      setSearchKeywords((prevKeywords) => [
                        ...prevKeywords,
                        keyword,
                      ])
                    }
                  >
                    {keyword}
                  </button>
                ))}
            </div>
          </div>

          <FaArrowRight
            className="w-10 h-10 text-2xl text-gray-500 my-auto hover:cursor-pointer"
            onClick={handleAddAllDefaultKeywords}
          />

          <textarea
            className="p-2 h-72 resize-none w-full rounded-md border bg-white focus:outline-none"
            placeholder="Enter Keywords for Analysis..."
            value={searchKeywords.join(" ")}
            onChange={(e) => setSearchKeywords(e.target.value.split(" "))}
          />
        </div>
        <DialogFooter className="flex flex-wrap sm:flex-nowrap justify-between items-center w-full space-y-2 sm:space-y-0 gap-10">
          <div className="flex flex-wrap sm:flex-nowrap w-full sm:w-1/2 space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="text"
              className="p-2 border rounded-md focus:outline-none focus:ring-blue-500 flex-grow min-w-[300px] w-full sm:w-auto h-10"
              placeholder="Enter Default Keywords..."
              onChange={handleInputChange}
            />
            <button
              className="px-4 bg-green-500 text-white rounded-md hover:bg-green-400 flex-grow w-full sm:w-auto h-10"
              onClick={handleAddDefaultKeyword}
            >
              +
            </button>
            <button
              className="px-4 bg-red-500 text-white rounded-md hover:bg-red-400 flex-grow w-full sm:w-auto h-10"
              onClick={handleDeleteDefaultKeyword}
            >
              -
            </button>
          </div>
          <div className="flex w-full sm:w-1/2">
            <DialogClose asChild>
              <button
                onClick={handleStartAnalysis}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 flex-grow w-full h-10"
              >
                Start Analysis
              </button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
