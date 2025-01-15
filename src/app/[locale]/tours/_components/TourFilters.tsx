import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/src/components/ui/select";
import { Slider } from "@/src/components/ui/slider";
import { Button } from "@/src/components/ui/button";
import { Tour } from "@/src/types/tours";
import FilterSectionLoader from "@/src/components/shared/loader/FilterSectionLoader";

interface FilterValues {
  destination?: string;
  minPrice: number;
  maxPrice: number;
}

interface TourFiltersProps {
  initialDestination?: string;
  initialMinPrice: number;
  initialMaxPrice: number;
  filtersData?: { data?: { tours?: Tour[] } };
  isLoading: boolean;
  onSearch: (filters: FilterValues) => void;
  onReset: () => void;
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function TourFilters({
  initialDestination,
  initialMinPrice,
  initialMaxPrice,
  filtersData,
  isLoading,
  onSearch,
  onReset,
}: TourFiltersProps) {
  const [selectedDestination, setSelectedDestination] = useState<
    string | undefined
  >(initialDestination || "all");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialMinPrice,
    initialMaxPrice,
  ]);

  useEffect(() => {
    setSelectedDestination(initialDestination || "all");
    setPriceRange([initialMinPrice, initialMaxPrice]);
  }, [initialDestination, initialMinPrice, initialMaxPrice]);

  const handleSearch = () => {
    onSearch({
      destination:
        selectedDestination === "all" ? undefined : selectedDestination,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  const handleReset = () => {
    setSelectedDestination("all");
    setPriceRange([0, 5000]);
    onReset();
  };

  const tours = filtersData?.data?.tours || [];
  const uniqueDestinations = Array.from(
    new Set(
      tours
        .map((tour) => tour.localizations[0]?.destination)
        .filter((destination): destination is string => !!destination)
    )
  ).sort();

  if (isLoading) {
    return <FilterSectionLoader />;
  }

  return (
    <div className="bg-[#f2f5ff] border border-gray-300 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center">
          <Filter className="mr-2 w-5 h-5" />
          Filters
        </h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-lg   p-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Location</h4>
                <Select
                  value={selectedDestination}
                  onValueChange={setSelectedDestination}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Location">
                      {selectedDestination === "all"
                        ? "All Locations"
                        : selectedDestination || "Select Location"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueDestinations.map((destination) => (
                      <SelectItem key={destination} value={destination}>
                        {destination}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Price Range</h4>
                <div className="flex items-center space-x-4">
                  <span className="w-16 text-right">
                    ${priceRange[0].toLocaleString()}
                  </span>
                  <Slider
                    defaultValue={[0, 5000]}
                    min={0}
                    max={5000}
                    step={10}
                    value={priceRange}
                    onValueChange={(value) =>
                      setPriceRange(value as [number, number])
                    }
                    className="flex-grow"
                  />
                  <span className="w-16 text-left">
                    ${priceRange[1].toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleSearch} className="w-full h-8">
            Search
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
