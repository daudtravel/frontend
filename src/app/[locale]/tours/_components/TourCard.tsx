import { useTranslations } from "next-intl";
import {
  User,
  Users,
  Moon,
  Wallet,
  Calendar1Icon,
  Timer,
  CalendarDays,
  Calendar1,
} from "lucide-react";
import Link from "next/link";
import { MapPin, ArrowRight, AlertCircle, MoreHorizontal } from "lucide-react";
import { Tour } from "@/src/types/tours";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";

export const TourCard = ({ tour }: { tour: Tour }) => {
  const t = useTranslations("tours");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const nextLocations = tour.localizations[0]?.next_location || [];
  const startLocation = tour.localizations[0]?.start_location;
  const endLocation = nextLocations[nextLocations.length - 1];

  return (
    <div className="flex flex-col md:flex-col w-full bg-[#f2f5ff] border border-gray-300 rounded-xl shadow-xs overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative w-full h-[200px] md:h-[230px]">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <div className="absolute top-4 right-4 z-10">
          {tour.type ? (
            <User className="w-6 h-6 text-white bg-main rounded-full p-1" />
          ) : (
            <Users className="w-6 h-6 text-white bg-main rounded-full p-1" />
          )}
        </div>
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <Image
          src={`https://api.daudtravel.com${tour?.image}`}
          fill
          className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          alt="Tour location"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          priority={false}
          loading="lazy"
        />

        {imageError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
      <div className="w-full py-4 px-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-row gap-2">
            <MapPin className="w-4 h-4 text-main" />
            <span className="text-sm font-bold">{t("startLocation")}:</span>
            <span className="text-sm line-clamp-1">
              {startLocation || "Unknown Location"}
            </span>
          </div>
          <div className="flex items-center gap-[3px]">
            <div className="flex items-center gap-2">
              <Calendar1 className="w-4 h-4 text-main" />
              <span className="text-sm">
                {tour.day} {t("day")}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm">
                / {tour.night} {t("night")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-main" />
          <span className="text-sm font-bold">{t("price")}:</span>
          <span className="text-sm">
            {tour.type
              ? t("agreement")
              : `${tour.group_prices?.total_price || 0} $`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-main" />
          <span className="text-sm font-bold">{t("startDate")}:</span>
          <span className="text-sm">
            {tour.type
              ? t("agreement")
              : new Date(tour.date).toLocaleDateString("en-CA")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {tour.type ? (
            <User className="w-4 h-4 text-main" />
          ) : (
            <Users className="w-4 h-4 text-main" />
          )}
          <span className="text-sm font-bold">{t("tourType")}:</span>
          <span className="text-sm">
            {tour.type ? t("individualTourType") : t("groupTourType")}
          </span>
        </div>
        {nextLocations.length > 0 && (
          <>
            <div className="xl:hidden relative py-4">
              <div className="absolute left-0 right-0 top-1/3 h-2 bg-white border-gray-300 border rounded-lg transform -translate-y-1/2" />
              <div className="flex justify-between items-center relative">
                <div className="flex flex-col items-center relative">
                  <div className="w-4 h-4 bg-orange-500 rounded-full z-10" />
                  <span className="text-xs font-medium text-center w-20 mt-2">
                    {startLocation}
                  </span>
                </div>
                {nextLocations.length > 1 && (
                  <div className="flex flex-col items-center relative px-2">
                    <MoreHorizontal className="w-5 h-5 text-main z-10" />
                    <span className="text-xs font-medium text-gray-500 text-center mt-2">
                      +{nextLocations.length - 1} {t("stops")}
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
              <div className="relative flex justify-between items-center">
                {[startLocation, ...nextLocations].map((location, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center relative"
                  >
                    <div className="w-4 h-4 bg-orange-500 rounded-full z-10" />
                    <span className="text-xs font-medium text-center w-20 mt-2 line-clamp-2">
                      {location}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        <Link className="block w-full mt-2" href={`/tours/${tour.id}`}>
          <Button className="w-full h-8 group">
            {t("viewDetails")}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
