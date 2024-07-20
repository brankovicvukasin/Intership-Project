"use client";
import { Button } from "@/components/ui/button";
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

interface DialogKeywordsNotFoundProps {
  notFoundKeywords: string[];
  url: string;
}

export function DialogKeywordsNotFound({
  notFoundKeywords,
  url,
}: DialogKeywordsNotFoundProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="">
          Not Found Keywords
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] sm:max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Keywords that are not found for:{" "}
            <span className="text-green-500">{url}</span>{" "}
          </DialogTitle>
          <DialogDescription>
            Here are presented all the keywords that were not found.
          </DialogDescription>
        </DialogHeader>
        <ul className="mt-7 text-gray-600 flex gap-2 flex-wrap justify-center sm:justify-start">
          {notFoundKeywords.map((keyword, index) => (
            <li
              key={index}
              className="bg-red-100 p-2 rounded-md cursor-pointer"
            >
              {keyword}
            </li>
          ))}
        </ul>
        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="w-96 bg-gray-300 hover:bg-gray-200"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
