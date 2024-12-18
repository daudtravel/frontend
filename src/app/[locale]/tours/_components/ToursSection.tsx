"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { MapPin, ArrowRight, Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/src/components/ui/select";
import { Slider } from "@/src/components/ui/slider";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import { GET_TOURS, GET_TOURS_FILTER } from "@/graphql/queries";
import { Tour } from "@/graphql/types";

export default function ToursSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination") || undefined;
  const initialMinPrice = parseFloat(searchParams.get("minPrice") || "50");
  const initialMaxPrice = parseFloat(searchParams.get("maxPrice") || "500");

  const [selectedDestination, setSelectedDestination] = useState<
    string | undefined
  >(destination);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialMinPrice,
    initialMaxPrice,
  ]);

  const { data: toursData, loading: toursLoading } = useQuery(GET_TOURS, {
    variables: {
      filters: {
        destination: {
          eq: destination,
        },
      },
    },

    fetchPolicy: "cache-first",
  });

  const { data: filtersData, loading: filtersLoading } = useQuery(
    GET_TOURS_FILTER,
    {
      fetchPolicy: "cache-first",
    }
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedDestination) {
      params.set("destination", selectedDestination);
    }

    router.push(`/tours?${params.toString()}`);
  };

  const destinationHandler = (value: string) => {
    setSelectedDestination(value);
    const params = new URLSearchParams();
    if (value) {
      params.set("destination", value);
    }

    router.push(`/tours?${params.toString()}`);
  };

  const handleReset = () => {
    setSelectedDestination(undefined);
    router.push("/tours");
  };

  return (
    <section className="container md:px-20 px-4 pt-10 md:pt-20 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Filter className="mr-2 w-5 h-5" /> Filters
          </h3>
          {filtersLoading ? (
            <div className="text-center">Loading tours...</div>
          ) : (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Location</h4>
              <Select
                value={selectedDestination ?? "Select"}
                onValueChange={destinationHandler}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Location">
                    {selectedDestination || "Select Location"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {filtersData?.tours?.length > 0 &&
                    filtersData?.tours?.map(
                      (item: { destination: string }, index: number) => (
                        <SelectItem
                          key={item.destination || index}
                          value={item.destination}
                        >
                          {item.destination}
                        </SelectItem>
                      )
                    )}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Price Range</h4>
            <div className="flex items-center space-x-4">
              <span className="w-10 text-right">${priceRange[0]}</span>
              <Slider
                defaultValue={[50, 500]}
                min={50}
                max={500}
                step={50}
                value={priceRange}
                onValueChange={(value) =>
                  setPriceRange(value as [number, number])
                }
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

        <div className="col-span-3 space-y-6">
          {toursLoading ? (
            <div className="text-center">Loading tours...</div>
          ) : toursData.tours.length > 0 ? (
            toursData.tours.map((item: Tour, index: number) => (
              <div
                key={index}
                className="flex bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative w-1/3 min-h-[250px]">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${item?.image?.url}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    alt={item.name ?? "alt"}
                    unoptimized
                  />
                </div>
                <div className="w-2/3 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-2xl line-clamp-1">
                        {item.name}
                      </h3>
                      <div className="bg-gray-100 rounded-full px-3 py-1 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{item.destination}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-gray-600 mb-6">
                      <div>
                        <span className="font-semibold text-xs block mb-1">
                          Total Price
                        </span>
                        <p className="text-lg font-bold">${item.price}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-xs block mb-1">
                          Duration
                        </span>
                        <p className="text-lg">{item.duration}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-xs block mb-1">
                          Reservation
                        </span>
                        <p className="text-lg font-bold">
                          ${item.reservation_price}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link href={`/tours/${item.documentId}`}>
                    <Button className="w-full">
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
    </section>
  );
}
