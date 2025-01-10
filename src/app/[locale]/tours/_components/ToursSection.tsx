"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
 
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import ToursSectionLoader from "@/src/components/shared/loader/ToursSectionLoader";
import { Tour } from "@/src/types/tours";
import TourFilters from "./TourFilters";
import { axiosInstance } from "@/src/utlis/axiosInstance";

interface QueryParams {
  destination: string | undefined;
  minPrice: number;
  maxPrice: number;
}

export default function ToursSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale;
  const urlDestination = searchParams.get("destination") || undefined;
  const urlMinPrice = parseFloat(searchParams.get("minPrice") || "0");
  const urlMaxPrice = parseFloat(searchParams.get("maxPrice") || "5000");

  const [queryParams, setQueryParams] = useState<QueryParams>({
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
  };

  const handleReset = () => {
    setQueryParams({
      destination: undefined,
      minPrice: 0,
      maxPrice: 5000,
    });
    router.push("/tours");
  };

  return (
    <main className="container min-h-screen md:px-20 px-4 pt-10 md:pt-20 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <TourFilters
          initialDestination={urlDestination}
          initialMinPrice={urlMinPrice}
          initialMaxPrice={urlMaxPrice}
          filtersData={filtersData}
          isLoading={filtersLoading}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        <div className="col-span-3 space-y-6">
          {isLoading ? (
            <ToursSectionLoader />
          ) : toursData?.data?.tours ? (
            toursData.data.tours.map((item: Tour, index: number) => (
              <div
                key={index}
                className="md:flex-row flex-col flex bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative w-full md:w-1/3 h-[200px] md:h-[250px]">
                  <Image
                    src={`http://localhost:3001${item?.image}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    alt={item.image ?? "alt"}
                  />
                </div>
                <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center md:items-start mb-4">
                      <h3 className="font-bold text-base md:text-2xl line-clamp-1">
                        {item.localizations[0].name}
                      </h3>
                      <div className="bg-gray-100 rounded-full px-3 py-1 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {item.localizations[0].destination}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-gray-600 mb-6">
                      <div>
                        <span className="font-semibold text-xs block mb-1">
                          Total Price
                        </span>
                        <p className="md:text-lg text-sm font-bold">
                          ${item.total_price}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-xs block mb-1">
                          Duration
                        </span>
                        <p className="md:text-lg text-sm">{item.duration}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-xs block mb-1">
                          Reservation
                        </span>
                        <p className="text-sm md:text-lg font-bold">
                          ${item.reservation_price}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link href={`/tours/${item.id}`}>
                    <Button className="w-full text-sm">
                      Explore Tour
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">No tours found</div>
          )}
        </div>
      </div>
    </main>
  );
}
