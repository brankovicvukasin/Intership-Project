"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface AppContextType {
  url: string;
  setUrl: Dispatch<SetStateAction<string>>;
  foundKeywords: { keyword: string; value: number }[];
  setFoundKeywords: Dispatch<
    SetStateAction<{ keyword: string; value: number }[]>
  >;
  notFoundKeywords: string[];
  setNotFoundKeywords: Dispatch<SetStateAction<string[]>>;
  searchKeywords: string[];
  setSearchKeywords: Dispatch<SetStateAction<string[]>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  sidebarChanged: boolean;
  setSidebarChanged: Dispatch<SetStateAction<boolean>>;
}

const defaultContextValue: AppContextType = {
  url: "",
  setUrl: () => {},
  foundKeywords: [],
  setFoundKeywords: () => {},
  notFoundKeywords: [],
  setNotFoundKeywords: () => {},
  searchKeywords: [],
  setSearchKeywords: () => {},
  isSidebarOpen: true,
  setIsSidebarOpen: () => {},
  sidebarChanged: true,
  setSidebarChanged: () => {},
};

const AppContext = createContext<AppContextType>(defaultContextValue);

export function AppProvider({ children }: { children: ReactNode }) {
  const [url, setUrl] = useState<string>("");
  const [foundKeywords, setFoundKeywords] = useState<
    { keyword: string; value: number }[]
  >([]);
  const [notFoundKeywords, setNotFoundKeywords] = useState<string[]>([]);
  const [searchKeywords, setSearchKeywords] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [sidebarChanged, setSidebarChanged] = useState<boolean>(true);

  const value = {
    url,
    setUrl,
    foundKeywords,
    setFoundKeywords,
    notFoundKeywords,
    setNotFoundKeywords,
    searchKeywords,
    setSearchKeywords,
    isSidebarOpen,
    setIsSidebarOpen,
    sidebarChanged,
    setSidebarChanged,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
