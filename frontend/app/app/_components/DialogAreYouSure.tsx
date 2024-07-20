"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RiDeleteBinLine } from "react-icons/ri";
import { deleteAnalysis } from "@/services/keywordsService";
import toast from "react-hot-toast";

interface DialogAreYouSureProps {
  analysisName: string;
  analysisId: string;
  setFetchedAnalysisNames: any;
}

export function DialogAreYouSure({
  analysisName,
  analysisId,
  setFetchedAnalysisNames,
}: DialogAreYouSureProps) {
  const handleDeleteAnalysisClick = async () => {
    try {
      const result = await deleteAnalysis(analysisId);
      setFetchedAnalysisNames(result.analysisData);
      toast.success("Analysis Successfuly Deleted");
    } catch (error) {
      toast.error("There was an error with this Analysis");
      console.error("Failed to fetch keywords:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <RiDeleteBinLine />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-8">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete {analysisName}?
          </DialogTitle>
          <DialogDescription>
            Once you delete it, you can`t bring it back.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center">
          <DialogClose>
            <div
              className="bg-red-500 hover:bg-red-400 text-white my-4 p-2 rounded-md"
              onClick={handleDeleteAnalysisClick}
            >
              Delete Analysis
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
