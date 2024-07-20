"use client";
import { useAppContext } from "@/context/appContext";
import Sidebar from "@/app/app/_components/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen } = useAppContext();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div
        className={`flex-1 h-full flex-col gap-4 overflow-y-auto justify-between transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
