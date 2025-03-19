import { useTranslations, useLocale } from "next-intl";
import {
  User,
  Users,
  Wallet,
  CalendarDays,
  Calendar1,
  PersonStanding,
  TextIcon,
} from "lucide-react";
import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import { Tour } from "@/src/types/tours";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";

export const TourCard = ({ tour }: { tour: Tour }) => {
  const t = useTranslations("tours");
  const currentLocale = useLocale();
  const isRTL = currentLocale === "ar";
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const nextLocations = tour.localizations[0]?.next_location || [];
  const startLocation = tour.localizations[0]?.start_location;
  const name = tour.localizations[0]?.name;
   

  const isCurrentSeasonSummer = () => {
    const currentMonth = new Date().getMonth();
    return currentMonth >= 5 && currentMonth <= 8;
  };

  const processLocations = () => {
    let allLocations = [startLocation, ...nextLocations].filter(Boolean);

    if (isRTL) {
      allLocations = allLocations.slice().reverse();
    }

    if (allLocations.length > 4) {
      return {
        displayLocations: [
          allLocations[0],
          allLocations[allLocations.length - 1],
        ],
        hasMoreLocations: true,
        moreLocationsCount: allLocations.length - 2,
      };
    }

    return {
      displayLocations: allLocations,
      hasMoreLocations: false,
      moreLocationsCount: 0,
    };
  };

  const { displayLocations, hasMoreLocations, moreLocationsCount } =
    processLocations();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="flex flex-col md:flex-col w-full bg-[#f2f5ff] border border-gray-300 rounded-xl shadow-xs overflow-hidden transition-all duration-300 hover:shadow-lg h-full">
      <Link
        className="block w-full h-full flex flex-col"
        href={`/tours/${tour.id}`}
      >
        <div className="relative w-full h-[200px] md:h-[230px] flex-shrink-0">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <div
            className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} z-10`}
          >
            {tour.type ? (
              <User className="w-6 h-6 text-white bg-main rounded-full p-1" />
            ) : (
              <Users className="w-6 h-6 text-white bg-main rounded-full p-1" />
            )}
          </div>
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

        <div
          className="w-full py-4 px-4 flex flex-col gap-4 flex-grow"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="flex items-center flex-row gap-2">
            <TextIcon className="w-4 h-4 text-main" />

            <span className="text-sm line-clamp-1">{name}</span>
          </div>
          <div className="flex md:items-center gap-3 md:gap-0 flex-col md:flex-row md:justify-between">
            <div className="flex items-center flex-row gap-2">
              <MapPin className="w-4 h-4 text-main" />
              <span className="text-sm font-bold">{t("startLocation")}:</span>
              <span className="text-sm line-clamp-1">
                  {startLocation}
                 
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
          <div className="md:flex-row flex-col flex gap-3 md:gap-0 md:items-center justify-between w-full">
            {tour.type && (
              <div>
                <div className="flex items-center gap-2">
                  <PersonStanding className="w-4 h-4 text-main" />
                  <span className="text-sm font-bold">
                    {t("numOfPersons")}:
                  </span>
                  <span className="text-sm">{tour.amount_persons}</span>
                </div>
              </div>
            )}
            <div className="flex flex-row items-center gap-2">
              <Wallet className="w-4 h-4 text-main" />
              <span className="text-sm font-bold">{t("price")}: </span>
              {tour.type ? (
                <>
                  <span
                    className={`text-sm ${
                      isCurrentSeasonSummer()
                        ? tour.individual_prices.season.discounted_price
                        : tour.individual_prices.off_season.discounted_price
                          ? "line-through text-gray-500"
                          : ""
                    }`}
                  >
                    {isCurrentSeasonSummer()
                      ? `${tour.individual_prices.season.total_price || 0} $`
                      : `${tour.individual_prices.off_season.total_price || 0} $`}
                  </span>
                  {isCurrentSeasonSummer()
                    ? tour.individual_prices.season.discounted_price && (
                        <span className="text-sm font-medium text-red-600">
                          {`${tour.individual_prices.season.discounted_price} $`}
                        </span>
                      )
                    : tour.individual_prices.off_season.discounted_price && (
                        <span className="text-sm font-medium text-red-600">
                          {`${tour.individual_prices.off_season.discounted_price} $`}
                        </span>
                      )}
                </>
              ) : (
                <>
                  <span
                    className={`text-sm ${tour.group_prices?.discounted_price ? "line-through text-gray-500" : ""}`}
                  >
                    {`${tour.group_prices?.total_price || 0} $`}
                  </span>

                  {tour.group_prices?.discounted_price && (
                    <span className="text-sm font-medium text-red-600">
                      {`${tour.group_prices?.discounted_price} $`}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-main" />
            <span className="text-sm font-bold">{t("startDate")}:</span>
            <span className="text-sm">
              {tour.type
                ? t("agreement")
                : new Date(tour.date).toLocaleDateString(
                    isRTL ? "ar" : "en-CA"
                  )}
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
            <div className="relative py-4 min-h-[80px]">
              <div className="absolute left-0 right-0 top-1/3 h-1 bg-white border-gray-300 border rounded-lg transform -translate-y-1/2" />
              <div
                className={`flex justify-between items-center relative ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div className="flex flex-col items-center relative">
                  <MapPin className="w-5 h-5 text-main" />
                  <div className="h-10 text-center mt-2 w-20">
                    <span className="text-xs font-medium block overflow-hidden text-ellipsis text-center">
                      {displayLocations[0]}
                    </span>
                  </div>
                </div>
                {hasMoreLocations && (
                  <div className="flex flex-col items-center relative px-2">
                    <MoreHorizontal className="w-5 h-5 text-main z-10" />
                    <span className="text-xs font-medium text-gray-500 text-center mt-2">
                      +{moreLocationsCount} {t("stops")}
                    </span>
                  </div>
                )}
                {!hasMoreLocations &&
                  displayLocations.length > 2 &&
                  displayLocations.slice(1, -1).map((location, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center relative"
                    >
                      <MapPin className="w-5 h-5 text-main" />
                      <div className="h-10 text-center mt-2 w-20">
                        <span className="text-xs font-medium block overflow-hidden text-ellipsis text-center">
                          {location}
                        </span>
                      </div>
                    </div>
                  ))}
                <div className="flex flex-col items-center relative">
                  <MapPin className="w-5 h-5 text-main" />
                  <div className="h-10 text-center mt-2 w-20">
                    <span className="text-xs font-medium block overflow-hidden text-ellipsis text-center">
                      {displayLocations[displayLocations.length - 1]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex-grow"></div>
          <Button className="w-full h-8 group mt-auto">
            {isRTL && (
              <ArrowIcon className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            )}
            {t("viewDetails")}
            {!isRTL && (
              <ArrowIcon className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </Button>
        </div>
      </Link>
    </div>
  );
};
