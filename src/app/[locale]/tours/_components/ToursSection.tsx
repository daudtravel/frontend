"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  Filter,
  AlertCircle,
  CalendarDaysIcon,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import ToursSectionLoader from "@/src/components/shared/loader/ToursSectionLoader";
import { Tour, ToursQueryParams } from "@/src/types/tours";
import TourFilters from "./TourFilters";
import { axiosInstance } from "@/src/utlis/axiosInstance";

const TourCard = ({ tour }: { tour: Tour }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const nextLocations = tour.localizations[0]?.next_location || [];
  const startLocation = tour.localizations[0]?.start_location;
  const endLocation = nextLocations[nextLocations.length - 1];

  return (
    <div className="flex flex-col md:flex-col w-full bg-[#f2f5ff] border border-gray-300 rounded-xl shadow-xs overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative w-full h-[200px] md:h-[230px]">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <Image
          src={`https://api.daudtravel.com${tour?.image}`}
          fill
          className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          alt="Tour location"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          priority={false}
          loading="lazy"
        />
        {imageError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
      <div className="w-full py-4 px-4 flex flex-col gap-2">
        <div className=" md:flex items-center justify-between">
          <div className="flex items-center flex-row gap-2">
            <MapPin className="w-4 h-4 text-main" />
            <span className="text-sm">საწყისი ლოკაცია:</span>
            <span className="text-sm line-clamp-1">
              {startLocation || "Unknown Location"}
            </span>
          </div>
          <div className=" hidden xl:flex items-center flex-row gap-2">
            <CalendarDaysIcon className="w-4 h-4 text-main mb-1" />
            <span className="text-sm">{tour.duration}</span>
            <span className="text-sm mb-1">დღე/ღამე</span>
          </div>
        </div>
        <div className="xl:hidden flex items-center flex-row gap-2">
          <CalendarDaysIcon className="w-4 h-4 text-main mb-1" />
          <span className="text-sm">{tour.duration}</span>
          <span className="text-sm mb-1">დღე/ღამე</span>
        </div>

        {nextLocations.length > 0 && (
          <>
            <div className="xl:hidden relative py-4">
              <div className="absolute left-0 right-0 top-1/3 h-2 bg-white border-gray-300 border rounded-lg transform -translate-y-1/2" />
              <div className="flex justify-between items-center relative">
                <div className="flex flex-col items-center relative">
                  <div className="w-4 h-4 bg-orange-500 rounded-full z-10" />
                  <span className="text-xs font-medium text-center w-20 mt-2">
                    {startLocation}
                  </span>
                </div>
                {nextLocations.length > 1 && (
                  <div className="flex flex-col items-center relative px-2">
                    <MoreHorizontal className="w-5 h-5 text-main z-10" />
                    <span className="text-xs font-medium text-gray-500 text-center mt-2">
                      +{nextLocations.length - 1} stops
                    </span>
                  </div>
                )}
                <div className="flex flex-col items-center relative">
                  <div className="w-4 h-4 bg-orange-500 rounded-full z-10" />
                  <span className="text-xs font-medium text-center w-20 mt-2">
                    {endLocation}
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden xl:block relative py-4">
              <div className="absolute left-0 right-0 top-1/3 h-2 bg-white border-gray-300 border rounded-lg transform -translate-y-1/2" />
              <div className="relative flex justify-between items-center">
                {[startLocation, ...nextLocations].map((location, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center relative"
                  >
                    <div className="w-4 h-4 bg-orange-500 rounded-full z-10" />
                    <span className="text-xs font-medium text-center w-20 mt-2 line-clamp-2">
                      {location}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        <Link className="block w-full mt-2" href={`/tours/${tour.id}`}>
          <Button className="w-full h-8 group">
            Explore Tour
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default function ToursSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale;
  const urlStartLocation = searchParams.get("start_location") || undefined;
  const urlMinPrice = parseFloat(searchParams.get("minPrice") || "0");
  const urlMaxPrice = parseFloat(searchParams.get("maxPrice") || "5000");
  const [showFilters, setShowFilters] = useState(false);

  const [queryParams, setQueryParams] = useState<ToursQueryParams>({
    start_location: urlStartLocation,
    minPrice: urlMinPrice,
    maxPrice: urlMaxPrice,
  });

  const { data: toursData, isLoading } = useQuery({
    queryKey: [
      "tours",
      "list",
      queryParams.start_location,
      queryParams.minPrice,
      queryParams.maxPrice,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get("/tours", {
        params: {
          start_location: queryParams.start_location,
          locale,
        },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });

  console.log(toursData);

  const { data: filtersData, isLoading: filtersLoading } = useQuery({
    queryKey: ["tours", "filters"],
    queryFn: async () => {
      const response = await axiosInstance.get("/toursAll", {
        params: { locale },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });

  const handleSearch = (filters: {
    start_location?: string;
    minPrice: number;
    maxPrice: number;
  }) => {
    setQueryParams({
      start_location: filters.start_location || undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    });

    const params = new URLSearchParams();
    if (filters.start_location) {
      params.set("start_location", filters.start_location);
    }
    params.set("minPrice", filters.minPrice.toString());
    params.set("maxPrice", filters.maxPrice.toString());
    router.push(`/tours?${params.toString()}`);
    setShowFilters(false);
  };

  const handleReset = () => {
    setQueryParams({
      start_location: undefined,
      minPrice: 0,
      maxPrice: 5000,
    });
    router.push("/tours");
    setShowFilters(false);
  };

  return (
    <main className="w-full min-h-screen md:px-20 xl:pr-36 px-4 pt-6 md:pt-20 pb-20">
      <div className="md:hidden mb-4">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center gap-2 h-8"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between justify-start w-full gap-10 md:gap-5 xl:gap-16">
        <div
          className={`w-full lg:w-[500px] xl:w-[550px] ${
            showFilters ? "block" : "hidden md:block"
          }`}
        >
          <TourFilters
            urlStartLocation={urlStartLocation}
            initialMinPrice={urlMinPrice}
            initialMaxPrice={urlMaxPrice}
            filtersData={filtersData}
            isLoading={filtersLoading}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </div>

        {isLoading ? (
          <ToursSectionLoader />
        ) : (
          <div
            className={`w-full grid lg:grid-cols-2 gap-10 md:gap-5 xl:gap-12 ${
              showFilters ? "hidden md:grid" : "grid"
            }`}
          >
            {toursData?.data?.tours?.length ? (
              toursData.data.tours.map((tour: Tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))
            ) : (
              <div className="text-center col-span-2 py-10">
                <p className="text-gray-600">
                  No tours found matching your criteria
                </p>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="mt-4"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
