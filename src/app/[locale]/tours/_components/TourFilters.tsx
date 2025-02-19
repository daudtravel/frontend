import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import FilterSectionLoader from "@/src/components/shared/loader/FilterSectionLoader";
import { FilterValues, TourFiltersProps } from "@/src/types/tourFilter";
import { useTranslations } from "next-intl";

export default function TourFilters({
  urlStartLocation,
  initialIsGroup,
  filtersData,
  isLoading,
  onSearch,
  onReset,
}: TourFiltersProps) {
  const t = useTranslations("tours");
  const [selectedDestination, setSelectedDestination] = useState<
    string | undefined
  >(urlStartLocation || "all");
  const [tourType, setTourType] = useState<string>(
    initialIsGroup === true
      ? "group"
      : initialIsGroup === false
        ? "individual"
        : "all"
  );

  const tourTypeLabels = {
    all: t("allTourTypes"),
    group: t("groupTourType"),
    individual: t("individualTourType"),
  };

  const handleSearch = () => {
    const filters: FilterValues = {};
    if (selectedDestination !== "all") {
      filters.start_location = selectedDestination;
    }
    if (tourType !== "all") {
      filters.isGroup = tourType === "group";
    }

    onSearch(filters);
  };

  const handleReset = () => {
    setSelectedDestination("all");
    setTourType("all");
    onReset();
  };

  const tours = filtersData?.data?.tours || [];
  const uniqueDestinations = Array.from(
    new Set(
      tours
        .map((tour) => tour.localizations[0]?.start_location)
        .filter((destination): destination is string => !!destination)
    )
  ).sort();

  useEffect(() => {
    setSelectedDestination(urlStartLocation || "all");
    setTourType(
      initialIsGroup === true
        ? "group"
        : initialIsGroup === false
          ? "individual"
          : "all"
    );
  }, [urlStartLocation, initialIsGroup]);

  if (isLoading) {
    return <FilterSectionLoader />;
  }

  return (
    <div className="bg-[#f2f5ff] border border-gray-300 rounded-xl shadow-xs p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl  flex items-center text-main font-semibold">
          <Filter className="mr-2 w-5 h-5 text-main" />
          {t("filter")}
        </h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-lg p-4">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2">{t("startLocation")}</h4>
                <Select
                  value={selectedDestination}
                  onValueChange={setSelectedDestination}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder={t("allLocations")}>
                      {selectedDestination === "all"
                        ? t("allLocations")
                        : selectedDestination || t("selectLocation")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allLocations")}</SelectItem>
                    {uniqueDestinations.map((destination) => (
                      <SelectItem key={destination} value={destination}>
                        {destination}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="mb-2">{t("tourType")}</h4>
                <Select value={tourType} onValueChange={setTourType}>
                  <SelectTrigger className="bg-white">
                    <SelectValue>
                      {tourTypeLabels[tourType as keyof typeof tourTypeLabels]}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{tourTypeLabels.all}</SelectItem>
                    <SelectItem value="group">
                      {tourTypeLabels.group}
                    </SelectItem>
                    <SelectItem value="individual">
                      {tourTypeLabels.individual}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleSearch} className="w-full h-8">
            {t("search")}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="icon"
            className="hover:bg-red-50 h-8 "
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
