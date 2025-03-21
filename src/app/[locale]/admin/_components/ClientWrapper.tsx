"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  UserCheck,
  Truck,
  Users,
  X,
  LogOut,
  ShieldQuestion,
  Video,
} from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ToursList } from "./tours/toursList/ToursList";
import { TransfersList } from "./transfers/transfersList/TransfersList";
import CreateTour from "./tours/createTour/CreateTour";
import { EditTour } from "./tours/editTour/EditTour";
import CreateTransfer from "./transfers/createTransfer/CreateTransfer";
import { DriversList } from "./drivers/driversList/DriversList";
import EditTransfer from "./transfers/editTransfer/EditTransfer";
import CreateDriver from "./drivers/createDriver/CreateDriver";
import { useAuth } from "@/src/auth/authProvider";
import FaqList from "./faq/faqList/faqList";
import CreateFaq from "./faq/createFaq/createFaq";
import EditFaq from "./faq/editFaq/editFaq";
import VideoList from "./video/videoList/VideoList";
import CreateVideo from "./video/createVideo/CreateVideo";

export const ClientWrapper = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tours = searchParams.get("tours");
  const transfers = searchParams.get("transfers");
  const drivers = searchParams.get("drivers");
  const faqs = searchParams.get("faqs");
  const video = searchParams.get("videos");

  const { logout } = useAuth();

  useEffect(() => {
    const hasNoParams =
      !searchParams.has("tours") &&
      !searchParams.has("transfers") &&
      !searchParams.has("drivers") &&
      !searchParams.has("faqs") &&
      !searchParams.has("videos");

    if (hasNoParams) {
      router.push(`${pathname}?tours=all`);
    }
  }, [pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigate = (query: string) => {
    router.push(`${pathname}${query}`);
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

    if (drivers === "createDriver") {
      return <CreateDriver />;
    }

    if (faqs === "all") {
      return <FaqList />;
    }

    if (faqs === "createFaq") {
      return <CreateFaq />;
    }

    if (faqs && faqs !== "all" && faqs !== "createFaq") {
      return <EditFaq params={{ id: faqs }} />;
    }
    if (video === "all") {
      return <VideoList />;
    }

    if (video === "createVideo") {
      return <CreateVideo />;
    }
    
    
  };

  return (
    <main className="flex min-h-screen bg- relative overflow-y-hidden">
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white transition-all duration-300 overflow-hidden rounded-lg border bg-card text-card-foreground shadow-lg mt-[2px]`}
      >
        <div className="flex items-center justify-between p-2 md:p-4 bg-slate-50">
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
            onClick={() => navigate("?tours=all")}
            className={`flex md:w-full items-center p-4 hover:bg-gray-100 ${
              tours ? "bg-gray-100" : ""
            }`}
          >
            <UserCheck size={20} />
            {isSidebarOpen && <span className="ml-4">ტურები</span>}
          </button>

          <button
            onClick={() => navigate("?transfers=all")}
            className={`flex md:w-full items-center p-4 hover:bg-gray-100 ${
              transfers ? "bg-gray-100" : ""
            }`}
          >
            <Truck size={20} />
            {isSidebarOpen && <span className="ml-4">ტრანსფერები</span>}
          </button>

          <button
            onClick={() => navigate("?drivers=all")}
            className={`flex md:w-full items-center p-4 hover:bg-gray-100 ${
              drivers ? "bg-gray-100" : ""
            }`}
          >
            <Users size={20} />
            {isSidebarOpen && <span className="ml-4">მძღოლები</span>}
          </button>
          <button
            onClick={() => navigate("?faqs=all")}
            className={`flex md:w-full items-center p-4 hover:bg-gray-100 ${
              faqs ? "bg-gray-100" : ""
            }`}
          >
            <ShieldQuestion size={20} />
            {isSidebarOpen && <span className="ml-4">F.A.Q</span>}
          </button>
          <button
            onClick={() => navigate("?videos=all")}
            className={`flex md:w-full items-center p-4 hover:bg-gray-100 ${
              video ? "bg-gray-100" : ""
            }`}
          >
            <Video size={20} />
            {isSidebarOpen && <span className="ml-4">ვიდეო</span>}
          </button>

          <button
            onClick={logout}
            className={`flex md:w-full items-center p-4 text-[red] `}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-4">გამოსვლა</span>}
          </button>
        </nav>
      </div>
      <div className="flex-1 overflow-auto  p-1 md:p-8 h-full">{renderContent()}</div>
    </main>
  );
};

export default ClientWrapper;
