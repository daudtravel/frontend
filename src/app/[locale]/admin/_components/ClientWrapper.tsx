"use client";

import { useState } from "react";
import { Menu, UserCheck, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToursList } from "./tours/toursList/ToursList";

import CreateTour from "./tours/createTour/CreateTour";
import { EditTour } from "./tours/editTour/EditTour";

export const ClientWrapper = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tours = searchParams.get("tours");
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    if (tours === "all") {
      return <ToursList />;
    }
    if (tours === "createTour") {
      return <CreateTour />;
    }

    if (tours && tours !== "all" && tours !== "createTour") {
      return <EditTour params={{ id: tours }} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg transition-all duration-300`}
      >
        <div className="flex items-center justify-between p-4">
          <h1 className={`font-bold ${isSidebarOpen ? "block" : "hidden"}`}>
            Admin Panel
          </h1>
          <button
            onClick={toggleSidebar}
            className="rounded-md p-2 hover:bg-gray-100"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-4">
          <button
            onClick={() => router.push(`?tours=all`)}
            className="flex w-full items-center p-4 hover:bg-gray-100"
          >
            <UserCheck size={20} />
            {isSidebarOpen && <span className="ml-4">Tours</span>}
          </button>
        </nav>
      </div>
      <div className="flex-1 overflow-auto p-8">{renderContent()}</div>
    </div>
  );
};

export default ClientWrapper;
