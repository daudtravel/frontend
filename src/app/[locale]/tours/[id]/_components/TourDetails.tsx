"use client";

import { Card } from "@/src/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import type { Tour } from "@/src/types/tours";
import { useParams } from "next/navigation";
import { toursAPI } from "@/src/routes/tours";
import ToursSectionLoader from "@/src/components/shared/loader/ToursSectionLoader";
import type { Prices } from "@/src/types/prices";
import Description from "./description/Description";
import Gallery from "./gallery/Gallery";
import Payment from "./payment/Payment";
import MainImage from "./mainImage/MainImage";
import { useMemo } from "react";

// Constants
const API_BASE_URL = "https://api.daudtravel.com";

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

  // Memoize processed data to avoid recalculations
  const processedData = useMemo(() => {
    if (!data) return null;

    const localization = data.localizations?.[0];
    const nextLocations = localization?.next_location || [];
    const startLocation = localization?.start_location;
    const endLocation =
      nextLocations.length > 0
        ? nextLocations[nextLocations.length - 1]
        : startLocation;

    return {
      // Main image data
      mainImage: {
        src: `${API_BASE_URL}${data.image}`,
        alt: localization?.name || "Tour main view",
      },

      // Description data
      description: {
        name: localization?.name,
        description: localization?.description,
        startLocation,
        endLocation,
        nextLocations,
        allDestinations: [startLocation, ...nextLocations].filter(
          (location): location is string => Boolean(location)
        ),
        day: data.day || "1",
        night: data.night || "0",
        numOfPersons: data.amount_persons,
        type: data.type || false,
        daily: data.daily,
        date: data.date || new Date().toISOString(),
        individualPrices: data.individual_prices,
        groupPrices: data.group_prices,
      },

      // Gallery data
      gallery: {
        images: (data.gallery || [])
          .filter((item) => item !== data.image)
          .map((item) => `${API_BASE_URL}${item}`),
        mainImageSrc: data.image,
      },

      // Payment data - now includes ALL tour information
      payment: {
        type: data.type || false,
        individualPrices: data.individual_prices,
        groupPrices: data.group_prices,
        // Include all tour details for payment form
        name: localization?.name,
        description: localization?.description,
        startLocation,
        endLocation,
        nextLocations,
        allDestinations: [startLocation, ...nextLocations].filter(
          (location): location is string => Boolean(location)
        ),
        day: data.day || "1",
        night: data.night || "0",
        numOfPersons: data.amount_persons,
        daily: data.daily,
        date: data.date || new Date().toISOString(),
        image: data.image,
        gallery: data.gallery || [],
      },
    };
  }, [data]);

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

  if (!processedData) {
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
      <section className="w-full px-4 md:px-20 py-10 min-h-screen">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <MainImage data={processedData.mainImage} />
            <Description data={processedData.description} />
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <Gallery data={processedData.gallery} />
            <Payment data={processedData.payment} />
          </div>
        </div>
      </section>
    </PhotoProvider>
  );
};

export default TourDetails;
