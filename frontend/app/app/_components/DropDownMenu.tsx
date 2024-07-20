import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LinearRegression } from "./LinerRegression";
import StandardDeviation from "./StandardDeviation";
import { Mean } from "./Mean";

interface Option {
  value: string;
  label: string;
}

interface LinearRegressionProps {
  data: AnalysisData[];
  dataDeviation: any;
  selectedKeywords: Option[];
}

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

export const DropDownMenyAnalysis: React.FC<LinearRegressionProps> = ({
  data,
  dataDeviation,
  selectedKeywords,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className=" hover:bg-blue-100 focus:outline-none focus:ring-0 p-2 border rounded-lg w-full">
          Analysis Charts
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit h-fit flex flex-col justify-center items-center gap-42 bg-white">
        <LinearRegression data={data} selectedKeywords={selectedKeywords} />
        <StandardDeviation data={data} selectedKeywords={selectedKeywords} />
        <Mean data={data} selectedKeywords={selectedKeywords} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
