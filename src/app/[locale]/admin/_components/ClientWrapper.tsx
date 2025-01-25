"use client";

import { useState, useEffect } from "react";
import { Menu, UserCheck, Truck, Users, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToursList } from "./tours/toursList/ToursList";
import { TransfersList } from "./transfers/transfersList/TransfersList";
import CreateTour from "./tours/createTour/CreateTour";
import { EditTour } from "./tours/editTour/EditTour";
import CreateTransfer from "./transfers/createTransfer/CreateTransfer";
import { DriversList } from "./drivers/driversList/DriversList";
import EditTransfer from "./transfers/editTransfer/EditTransfer";
// import CreateDriver from "./drivers/createDriver/CreateDriver";

export const ClientWrapper = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tours = searchParams.get("tours");
  const transfers = searchParams.get("transfers");
  const drivers = searchParams.get("drivers");

  useEffect(() => {
    if (!tours && !transfers && !drivers) {
      router.push("?tours=all");
    }
  }, [tours, transfers, drivers, router]);

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

    if (transfers === "all") {
      return <TransfersList />;
    }
    if (transfers === "createTransfer") {
      return <CreateTransfer />;
    }

    if (transfers && transfers !== "all" && transfers !== "createTransfer") {
      return <EditTransfer params={{ id: transfers }} />;
    }

    if (drivers === "all") {
      return <DriversList />;
    }
    // if (drivers === "createDriver") {
    //   return <CreateDriver />;
    // }
    // Uncomment if needed
    // if (drivers && drivers !== "all" && drivers !== "createDriver") {
    //   return <EditDriver params={{ id: drivers }} />;
    // }
  };

  return (
    <main className="flex min-h-screen bg- relative overflow-y-hidden">
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white transition-all duration-300 overflow-hidden rounded-lg border bg-card text-card-foreground shadow-lg mt-[2px]`}
      >
        <div className="flex items-center justify-between p-4 bg-slate-50">
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

        <nav className="mt-4 space-y-1">
          <button
            onClick={() => router.push("?tours=all")}
            className={`flex w-full items-center p-4 hover:bg-gray-100 ${
              tours ? "bg-gray-100" : ""
            }`}
          >
            <UserCheck size={20} />
            {isSidebarOpen && <span className="ml-4">ტურები</span>}
          </button>

          <button
            onClick={() => router.push("?transfers=all")}
            className={`flex w-full items-center p-4 hover:bg-gray-100 ${
              transfers ? "bg-gray-100" : ""
            }`}
          >
            <Truck size={20} />
            {isSidebarOpen && <span className="ml-4">ტრანსფერები</span>}
          </button>

          <button
            onClick={() => router.push("?drivers=all")}
            className={`flex w-full items-center p-4 hover:bg-gray-100 ${
              drivers ? "bg-gray-100" : ""
            }`}
          >
            <Users size={20} />
            {isSidebarOpen && <span className="ml-4">მძღოლები</span>}
          </button>
        </nav>
      </div>
      <div className="flex-1 overflow-auto p-8 h-full">{renderContent()}</div>
    </main>
  );
};

export default ClientWrapper;
