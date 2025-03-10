"use client";

import { Card } from "@/src/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Tour } from "@/src/types/tours";
import { useParams } from "next/navigation";
import { toursAPI } from "@/src/routes/tours";
import ToursSectionLoader from "@/src/components/shared/loader/ToursSectionLoader";
import { Prices } from "@/src/types/prices";
import Description from "./description/Description";
import Gallery from "./gallery/Gallery";
import Payment from "./payment/Payment";
import MainImage from "./mainImage/MainImage";

const TourDetails = () => {
  const params = useParams();
  const id = params.id as string;
  const locale = params.locale as string;

  const {
    data: tourData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tours", id, locale],
    queryFn: () => toursAPI.getById(id, locale || "ka"),
  });

  const data = tourData?.data?.tour as (Tour & { prices: Prices }) | undefined;

  if (isLoading) {
    return <ToursSectionLoader />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-red-500 text-center">
            Error loading tour data. Please try again later.
          </p>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full min-h-screen mx-auto p-4 sm:p-6">
        <Card className="p-6">
          <p className="text-gray-500 text-center">No tour data available</p>
        </Card>
      </div>
    );
  }

  return (
    <PhotoProvider>
      <section className="w-full px-4 md:px-20 py-10  min-h-screen">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <MainImage data={data} />
            <Description data={data} />
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <Gallery data={data} />
            <Payment data={data} />
          </div>
        </div>
      </section>
    </PhotoProvider>
  );
};

export default TourDetails;
