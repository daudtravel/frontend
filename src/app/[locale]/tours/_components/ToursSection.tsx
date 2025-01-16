"use client";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowRight, Filter } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import ToursSectionLoader from "@/src/components/shared/loader/ToursSectionLoader";
import { Tour, ToursQueryParams } from "@/src/types/tours";
import TourFilters from "./TourFilters";
import { axiosInstance } from "@/src/utlis/axiosInstance";

export default function ToursSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale;
  const urlDestination = searchParams.get("destination") || undefined;
  const urlMinPrice = parseFloat(searchParams.get("minPrice") || "0");
  const urlMaxPrice = parseFloat(searchParams.get("maxPrice") || "5000");
  const [showFilters, setShowFilters] = useState(false);

  const [queryParams, setQueryParams] = useState<ToursQueryParams>({
    destination: urlDestination,
    minPrice: urlMinPrice,
    maxPrice: urlMaxPrice,
  });

  const { data: toursData, isLoading } = useQuery({
    queryKey: [
      "tours",
      "list",
      queryParams.destination,
      queryParams.minPrice,
      queryParams.maxPrice,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get("/tours", {
        params: {
          destination: queryParams.destination,
          locale,
          minPrice: queryParams.minPrice,
          maxPrice: queryParams.maxPrice,
        },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const { data: filtersData, isLoading: filtersLoading } = useQuery({
    queryKey: ["tours", "filters"],
    queryFn: async () => {
      const response = await axiosInstance.get("/tours", {
        params: { locale },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const handleSearch = (filters: {
    destination?: string;
    minPrice: number;
    maxPrice: number;
  }) => {
    setQueryParams({
      destination: filters.destination || undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    });

    const params = new URLSearchParams();
    if (filters.destination) {
      params.set("destination", filters.destination);
    }
    params.set("minPrice", filters.minPrice.toString());
    params.set("maxPrice", filters.maxPrice.toString());
    router.push(`/tours?${params.toString()}`);
    setShowFilters(false);
  };

  const handleReset = () => {
    setQueryParams({
      destination: undefined,
      minPrice: 0,
      maxPrice: 5000,
    });
    router.push("/tours");
    setShowFilters(false);
  };

  return (
    <main className="w-full min-h-screen md:pl-20 md:pr-36 px-4 pt-10 md:pt-20 pb-20">
      <div className="md:hidden mb-4">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center gap-2"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between justify-start w-full gap-10 md:gap-5 xl:gap-16">
        <div
          className={`w-full xl:w-[550px] ${showFilters ? "block" : "hidden md:block"}`}
        >
          <TourFilters
            initialDestination={urlDestination}
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
            className={`w-full grid md:grid-cols-1 lg:grid-cols-2 md:gap-5 gap-10 xl:gap-12 ${showFilters ? "hidden md:grid" : "grid"}`}
          >
            {toursData?.data?.tours.length ? (
              toursData.data.tours.map((item: Tour, index: number) => (
                <div
                  key={index}
                  className="md:flex-col flex-col w-full flex bg-[#f2f5ff] border border-gray-300 rounded-xl shadow-lg overflow-hidden transition-all duration-300"
                >
                  <div className="relative w-full md:w-full h-[200px] md:h-[230px]">
                    <Image
                      src={`https://api.daudtravel.com${item?.image}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      alt={item.image ?? "alt"}
                    />
                  </div>
                  <div className="w-full px-6 py-6 gap-5 flex flex-col justify-between">
                    <div className="flex items-center">
                      <MapPin className="w-6 h-6 mr-2 text-main" />
                      <span className="text-sm md:text-xl">
                        {item.localizations[0].destination}
                      </span>
                    </div>
                    <div className="flex flex-row justify-between w-full text-gray-600 items-center">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-xs block mb-1">
                          Total Price
                        </span>
                        <p className="md:text-lg text-sm font-bold">
                          ${item.total_price}
                        </p>
                      </div>
                      <div className="h-8 w-px bg-gray-300" />
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-xs block mb-1">
                          Duration
                        </span>
                        <p className="md:text-lg text-sm">{item.duration}</p>
                      </div>
                      <div className="h-8 w-px bg-gray-300" />
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-xs block mb-1">
                          Reservation
                        </span>
                        <p className="text-sm md:text-lg font-bold">
                          ${item.reservation_price}
                        </p>
                      </div>
                    </div>
                    <div className="w-full">
                      <Link className="w-full" href={`/tours/${item.id}`}>
                        <Button className="w-full text-sm h-8">
                          Explore Tour
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">No tours found</div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
