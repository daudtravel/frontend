"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Calendar,
  DollarSign,
  Users,
  Plus,
  Minus,
  MoreHorizontal,
  ArrowDown,
  Bus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Tour } from "@/src/types/tours";
import { useParams } from "next/navigation";
import Image from "next/image";
import TourLoader from "@/src/components/shared/loader/TourLoader";
import { toursAPI } from "@/src/routes/tours";
import renderDescription from "@/src/components/textEditor/RenderText";

const TourDetails = () => {
  const params = useParams();
  const id = params.id as string;
  const locale = params.locale as string;
  const [peopleCount, setPeopleCount] = useState(1);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [loadedGalleryImages, setLoadedGalleryImages] = useState<
    Record<number, boolean>
  >({});
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false);

  const {
    data: tourData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tours", locale],
    queryFn: () => toursAPI.getById(id, locale || "ka"),
  });

  const data = tourData?.data?.tour as Tour | undefined;

  if (isLoading) return <TourLoader />;
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

  const description =
    data.localizations?.[0]?.description || "No description available";
  const gallery = data.gallery || [];
  const price = data.total_price || 0;
  const nextLocations = data.localizations[0]?.next_location || [];
  const startLocation = data.localizations[0]?.start_location;
  const endLocation = nextLocations[nextLocations.length - 1];
  const allDestinations = [startLocation, ...nextLocations];

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

  const DestinationsModal = () => (
    <Dialog open={isDestinationsOpen} onOpenChange={setIsDestinationsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tour Destinations</DialogTitle>
        </DialogHeader>
        <div className="relative py-6">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-200" />
          {allDestinations.map((location, index) => (
            <div
              key={index}
              className="relative flex items-center mb-6 last:mb-0"
            >
              <div className="absolute left-6 -ml-[9px] w-4 h-4 bg-blue-500 rounded-full" />
              {index !== allDestinations.length - 1 && (
                <ArrowDown className="absolute left-6 -ml-[5px] top-6 w-3 h-3 text-blue-500" />
              )}
              <div className="ml-12">
                <p className="text-base font-medium">{location}</p>
                {index === 0 && (
                  <span className="text-sm text-blue-500">Starting point</span>
                )}
                {index === allDestinations.length - 1 && (
                  <span className="text-sm text-blue-500">
                    Final destination
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );

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
                {nextLocations.length > 0 && (
                  <>
                    <div className="xl:hidden relative py-4">
                      <div className="absolute left-0 right-0 top-1/3 h-2 bg-white border-gray-300 border rounded-lg transform -translate-y-1/2" />
                      <div className="absolute left-0 right-0 top-1/3 transform -translate-y-1/2">
                        <div className="animate-[moveRight_10s_linear_infinite]">
                          <Bus className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center relative">
                        <div className="flex flex-col items-center relative">
                          <div className="w-4 h-4 bg-orange-500 rounded-full z-10" />
                          <span className="text-xs font-medium text-center w-20 mt-2">
                            {startLocation}
                          </span>
                        </div>
                        {nextLocations.length > 1 && (
                          <div
                            className="flex flex-col items-center relative px-2 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setIsDestinationsOpen(true)}
                          >
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
                      <div className="absolute left-0 right-0 top-1/3 transform -translate-y-1/2">
                        <div className="animate-[moveRight_10s_linear_infinite]">
                          <Bus className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="relative flex justify-between items-center">
                        {[startLocation, ...nextLocations].map(
                          (location, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-center relative"
                            >
                              <div className="w-4 h-4 bg-orange-500 rounded-full z-10" />
                              <span className="text-xs font-medium text-center w-20 mt-2 line-clamp-2">
                                {location}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}
                <div className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg leading-relaxed">
                  {renderDescription(description)}
                </div>

                <style jsx>{`
                  @keyframes moveRight {
                    from {
                      transform: translateX(-2rem) translateY(-50%);
                    }
                    to {
                      transform: translateX(calc(100% + 2rem)) translateY(-50%);
                    }
                  }
                `}</style>
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
                {gallery.map((item, index) => (
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
        <DestinationsModal />
      </section>
    </PhotoProvider>
  );
};

export default TourDetails;
