"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Calendar, DollarSign, Users, Plus, Minus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

import { Tour } from "@/src/types/tours";
import { useParams } from "next/navigation";
import Image from "next/image";
import { axiosInstance } from "@/src/utlis/axiosInstance";

const TourDetails = () => {
  const params = useParams();
  const id = params.id;
  const [peopleCount, setPeopleCount] = useState(1);

  const { data: tourData, isLoading } = useQuery({
    queryKey: ["tour", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/tours/${id}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const data = tourData?.data?.tour as Tour | undefined;

  if (isLoading) {
    return <div className="max-w-7xl mx-auto p-4 sm:p-6">Loading...</div>;
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">No tour data available</div>
    );
  }

  const destination =
    data.localizations?.[0]?.destination || "Destination not available";
  const description =
    data.localizations?.[0]?.description || "No description available";
  const gallery = data.gallery || [];
  const price = data.total_price || 0;

  const handleDecrease = () => {
    if (peopleCount > 1) {
      setPeopleCount((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    setPeopleCount((prev) => prev + 1);
  };

  return (
    <PhotoProvider>
      <section className="w-full md:px-20 py-10 gap-10">
        <div className="flex flex-row gap-10">
          <div className="relative h-[500px] w-1/2 rounded-lg overflow-hidden mb-6">
            <PhotoView src={`https://api.daudtravel.com${data.image}`}>
              <Image
                src={`https://api.daudtravel.com${data.image}`}
                alt="Tour main view"
                fill
                className="w-full h-full object-cover cursor-pointer"
              />
            </PhotoView>
          </div>

          <Card className="w-1/2 h-[500px] top-6">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex-grow">
                <h2 className="text-3xl font-semibold mb-4">{destination}</h2>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-6 text-gray-600">
                  <Calendar className="w-3 h-3 text-blue-500" />
                  <p className="text-sm">Flexible booking dates</p>
                </div>
                <div className="flex items-center gap-6 text-gray-600">
                  <Users className="w-3 h-3 text-blue-500" />
                  <p className="text-sm">Small group size</p>
                </div>
                <div className="flex items-center gap-6 text-gray-600">
                  <DollarSign className="w-3 h-3 text-blue-500" />
                  <p className="text-sm">Free cancellation up to 7 days</p>
                </div>
              </div>

              <div className="mt-8 border-t pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleDecrease}
                      className="h-10 w-10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-xl font-semibold min-w-[2rem] text-center">
                      {peopleCount}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleIncrease}
                      className="h-10 w-10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total price</p>
                    <p className="text-3xl font-bold text-blue-600">
                      ${(price * peopleCount).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button className="w-full text-lg py-6">Book Now</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full mt-10">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
            <div className="grid grid-cols-5 gap-5">
              {gallery.map((item, index) => (
                <PhotoView
                  key={index}
                  src={`https://api.daudtravel.com${item}`}
                >
                  <div className="h-44 rounded-lg overflow-hidden cursor-pointer">
                    <div className="w-full h-full relative">
                      <Image
                        src={`https://api.daudtravel.com${item}`}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="w-40 h-40 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </PhotoView>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </PhotoProvider>
  );
};

export default TourDetails;
