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
import ToursSectionLoader from "@/src/components/shared/loader/ToursSectionLoader";

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
  >(initialDestination);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialMinPrice,
    initialMaxPrice,
  ]);

  useEffect(() => {
    setSelectedDestination(initialDestination);
    setPriceRange([initialMinPrice, initialMaxPrice]);
  }, [initialDestination, initialMinPrice, initialMaxPrice]);

  const handleSearch = () => {
    onSearch({
      destination: selectedDestination,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  const handleReset = () => {
    setSelectedDestination(undefined);
    setPriceRange([0, 5000]);
    onReset();
  };

  const tours = filtersData?.data?.tours || [];

  return (
    <div className="col-span-1 bg-gray-50 p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <Filter className="mr-2 w-5 h-5" /> Filters
      </h3>
      {isLoading ? (
        <ToursSectionLoader />
      ) : (
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Location</h4>
          <Select
            value={selectedDestination ?? "Select"}
            onValueChange={setSelectedDestination}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Location">
                {selectedDestination || "Select Location"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {tours.map((item: Tour, index: number) => (
                <SelectItem
                  key={item.id || index}
                  value={item.localizations[0].destination}
                >
                  {item.localizations[0].destination}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Price Range</h4>
        <div className="flex items-center space-x-4">
          <span className="w-10 text-right">${priceRange[0]}</span>
          <Slider
            defaultValue={[0, 5000]}
            min={0}
            max={5000}
            step={10}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            className="flex-grow"
          />
          <span className="w-10 text-left">${priceRange[1]}</span>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button onClick={handleSearch} className="w-full">
          Search
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          size="icon"
          className="hover:bg-red-50"
        >
          <X className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
}
