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
import TourLoader from "@/src/components/shared/loader/TourLoader";

const TourDetails = () => {
  const params = useParams();
  const id = params.id;
  const [peopleCount, setPeopleCount] = useState(1);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [loadedGalleryImages, setLoadedGalleryImages] = useState<
    Record<number, boolean>
  >({});

  const {
    data: tourData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tour", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/tours/${id}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });

  const data = tourData?.data?.tour as Tour | undefined;

  if (isLoading) {
    return <TourLoader />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <p className="text-red-500">
          Error loading tour data. Please try again later.
        </p>
      </div>
    );
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

  const handleGalleryImageLoad = (index: number) => {
    setLoadedGalleryImages((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  return (
    <PhotoProvider>
      <section className="w-full px-4 md:px-20 py-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="w-full md:w-1/2 h-[250px] md:h-[500px] rounded-lg overflow-hidden mb-6">
            <PhotoView src={`https://api.daudtravel.com${data.image}`}>
              <div className="relative w-full h-full">
                {!mainImageLoaded && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                )}
                <Image
                  src={`https://api.daudtravel.com${data.image}`}
                  alt="Tour main view"
                  fill
                  priority
                  className={`w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${
                    mainImageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setMainImageLoaded(true)}
                />
              </div>
            </PhotoView>
          </div>
          <Card className="w-full md:w-1/2 mb-6">
            <CardContent className="p-4 md:p-6 flex flex-col h-full">
              <div className="flex-grow">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                  {destination}
                </h2>
                <p className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg leading-relaxed">
                  {description}
                </p>
              </div>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-4 text-gray-600">
                  <Calendar className="w-4 h-4 md:w-3 md:h-3 text-blue-500" />
                  <p className="text-xs md:text-sm">Flexible booking dates</p>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <Users className="w-4 h-4 md:w-3 md:h-3 text-blue-500" />
                  <p className="text-xs md:text-sm">Small group size</p>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <DollarSign className="w-4 h-4 md:w-3 md:h-3 text-blue-500" />
                  <p className="text-xs md:text-sm">
                    Free cancellation up to 7 days
                  </p>
                </div>
              </div>

              <div className="mt-6 md:mt-8 border-t pt-4 md:pt-6">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="flex items-center gap-2 md:gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleDecrease}
                      className="h-8 w-8 md:h-10 md:w-10"
                    >
                      <Minus className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                    <span className="text-base md:text-xl font-semibold min-w-[2rem] text-center">
                      {peopleCount}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleIncrease}
                      className="h-8 w-8 md:h-10 md:w-10"
                    >
                      <Plus className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs md:text-sm text-gray-500">
                      Total price
                    </p>
                    <p className="text-xl md:text-3xl font-bold text-blue-600">
                      ${(price * peopleCount).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button className="w-full text-base md:text-lg py-4 md:py-6">
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {gallery.length > 0 && (
          <Card className="w-full mt-6 md:mt-10">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
                Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
                {data.gallery.map((item, index) => (
                  <PhotoView
                    key={index}
                    src={`https://api.daudtravel.com${item}`}
                  >
                    <div className="h-[150px] md:h-[220px] rounded-lg overflow-hidden cursor-pointer">
                      <div className="w-full h-full relative">
                        {!loadedGalleryImages[index] && (
                          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                        )}
                        <Image
                          src={`https://api.daudtravel.com${item}`}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          loading="lazy"
                          className={`w-full h-full object-cover hover:scale-105 transition-all duration-300 ${
                            loadedGalleryImages[index]
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                          onLoad={() => handleGalleryImageLoad(index)}
                        />
                      </div>
                    </div>
                  </PhotoView>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </PhotoProvider>
  );
};

export default TourDetails;
