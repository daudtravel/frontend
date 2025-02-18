"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/src/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import ToursSectionLoader from "@/src/components/shared/loader/ToursSectionLoader";
import { Tour, ToursQueryParams } from "@/src/types/tours";
import TourFilters from "./TourFilters";
import { axiosInstance } from "@/src/utlis/axiosInstance";
import { Filter } from "lucide-react";
import { TourCard } from "./TourCard";
import { useTranslations } from "next-intl";

export default function ToursSection() {
  const t = useTranslations("tours");
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale;
  const urlStartLocation = searchParams.get("start_location") || undefined;
  const urlIsGroup = searchParams.has("isGroup")
    ? searchParams.get("isGroup") === "true"
    : undefined;

  const [showFilters, setShowFilters] = useState(false);
  const [queryParams, setQueryParams] = useState<ToursQueryParams>({
    start_location: urlStartLocation,
    isGroup: urlIsGroup,
  });

  useEffect(() => {
    setQueryParams({
      start_location: urlStartLocation,
      isGroup: urlIsGroup,
    });
  }, [urlStartLocation, urlIsGroup]);

  const { data: toursData, isLoading } = useQuery({
    queryKey: [
      "tours",
      "list",
      queryParams.start_location,
      queryParams.isGroup,
    ],
    queryFn: async () => {
      const params: any = { locale };

      if (queryParams.start_location) {
        params.start_location = queryParams.start_location;
      }

      if (queryParams.isGroup !== undefined) {
        params.isGroup = String(queryParams.isGroup);
      }

      const response = await axiosInstance.get("/tours", { params });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });

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
    isGroup?: boolean;
  }) => {
    const newParams = new URLSearchParams();
    if (filters.start_location) {
      newParams.set("start_location", filters.start_location);
    }
    if (filters.isGroup !== undefined) {
      newParams.set("isGroup", String(filters.isGroup));
    }

    setQueryParams({
      start_location: filters.start_location,
      isGroup: filters.isGroup,
    });

    let basePath = `/${locale}/tours`;
    const searchString = newParams.toString();
    const newUrl = searchString ? `${basePath}?${searchString}` : basePath;

    router.push(newUrl);
    setShowFilters(false);
  };

  const handleReset = () => {
    setQueryParams({
      start_location: undefined,
      isGroup: undefined,
    });
    router.push(`/${locale}/tours`);
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
          {showFilters ? t("hideFilter") : t("showFilter")}
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
            initialIsGroup={urlIsGroup}
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
            {toursData?.data?.tours?.length > 0 ? (
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
