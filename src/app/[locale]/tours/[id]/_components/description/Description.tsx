"use client";

import renderDescription from "@/src/components/textEditor/RenderText";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  CalendarDays,
  ChevronRight,
  GroupIcon,
  MapPin,
  MoreHorizontal,
  PersonStanding,
  Timer,
  Wallet,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import React, { useState, useMemo, useCallback } from "react";
import { cn } from "@/src/utlis/cn";

interface DescriptionProps {
  data: {
    name?: string;
    description?: string;
    startLocation?: string;
    endLocation?: string;
    nextLocations: string[];
    allDestinations: string[];
    day: string;
    night: string;
    numOfPersons?: number;
    type: boolean;
    daily?: boolean;
    date: string;
    individualPrices?: any;
    groupPrices?: any;
  };
}

const Description = React.memo<DescriptionProps>(({ data }) => {
  const t = useTranslations("tours");
  const currentLocale = useLocale();
  const isRTL = currentLocale === "ar";
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false);

  const handleDestinationsToggle = useCallback(() => {
    setIsDestinationsOpen((prev) => !prev);
  }, []);

  const isCurrentSeasonSummer = useCallback(() => {
    const currentMonth = new Date().getMonth();
    return currentMonth >= 5 && currentMonth <= 8;
  }, []);

  const locationConfig = useMemo(() => {
    const MAX_VISIBLE_DESKTOP_LOCATIONS = 5;
    const showMoreOnDesktop =
      data.allDestinations.length > MAX_VISIBLE_DESKTOP_LOCATIONS;

    // Filter out any undefined values and ensure we have valid locations
    const validLocations = [data.startLocation, ...data.nextLocations].filter(
      (location): location is string => Boolean(location)
    );

    const allLocations = isRTL ? [...validLocations].reverse() : validLocations;

    const getVisibleDesktopLocations = () => {
      if (allLocations.length > MAX_VISIBLE_DESKTOP_LOCATIONS) {
        if (isRTL) {
          return [
            allLocations[0],
            allLocations[1],
            allLocations[allLocations.length - 2],
            allLocations[allLocations.length - 1],
          ].filter(Boolean);
        } else {
          return [
            allLocations[0],
            allLocations[1],
            allLocations[allLocations.length - 2],
            allLocations[allLocations.length - 1],
          ].filter(Boolean);
        }
      }
      return allLocations;
    };

    const visibleDesktopLocations = getVisibleDesktopLocations();
    const middleIndex = Math.floor(visibleDesktopLocations.length / 2);

    return {
      showMoreOnDesktop,
      visibleDesktopLocations,
      middleIndex,
      allLocations,
    };
  }, [data.allDestinations, data.startLocation, data.nextLocations, isRTL]);

  const priceInfo = useMemo(() => {
    const isSummer = isCurrentSeasonSummer();

    if (data.type) {
      const seasonPrices = isSummer
        ? data.individualPrices?.season
        : data.individualPrices?.off_season;

      return {
        originalPrice: seasonPrices?.total_price || 0,
        discountedPrice: seasonPrices?.discounted_price,
        hasDiscount: !!seasonPrices?.discounted_price,
      };
    } else {
      return {
        originalPrice: data.groupPrices?.total_price || 0,
        discountedPrice: data.groupPrices?.discounted_price,
        hasDiscount: !!data.groupPrices?.discounted_price,
      };
    }
  }, [
    data.type,
    data.individualPrices,
    data.groupPrices,
    isCurrentSeasonSummer,
  ]);

  const formattedDate = useMemo(() => {
    if (data.type) return t("agreement");
    if (data.daily) return t("everyDay");

    const localeMap = {
      ka: "ka-GE",
      ar: "ar-SA",
      ru: "ru-RU",
      tr: "tr-TR",
    };

    try {
      return new Date(data.date).toLocaleDateString(
        localeMap[currentLocale as keyof typeof localeMap] || "en-CA"
      );
    } catch {
      return "Invalid Date";
    }
  }, [data.type, data.daily, data.date, currentLocale, t]);

  const ArrowIcon = useMemo(
    () =>
      ({ className }: { className?: string }) => (
        <ChevronRight
          className={cn(
            isRTL ? "rotate-180 text-gray-400" : "text-gray-400",
            className
          )}
        />
      ),
    [isRTL]
  );

  const getDestinationsText = useCallback(() => {
    const destinationsToDisplay = isRTL
      ? [...data.allDestinations].reverse()
      : data.allDestinations;

    if (destinationsToDisplay.length === 0) return null;

    return (
      <div className="mb-6 p-3 bg-gray-50 rounded-md">
        <h4 className="font-medium mb-2">{t("tourDestinations")}:</h4>
        <div
          className={`flex flex-wrap items-center ${isRTL ? "flex-row-reverse" : "flex-row"}`}
        >
          {destinationsToDisplay.map((location, index, array) => (
            <div key={`text-destination-${index}`}>
              <div className="flex items-center">
                <span className="text-sm">{location}</span>
                {isRTL ? (
                  <>
                    {index === 0 && array.length > 1 && (
                      <span className="ml-1 text-xs font-medium text-main">
                        ({t("endLocation")})
                      </span>
                    )}
                    {index === array.length - 1 && (
                      <span className="ml-1 text-xs font-medium text-main">
                        ({t("startLocation")})
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {index === 0 && (
                      <span className="ml-1 text-xs font-medium text-main">
                        ({t("startLocation")})
                      </span>
                    )}
                    {index === array.length - 1 && array.length > 1 && (
                      <span className="ml-1 text-xs font-medium text-main">
                        ({t("endLocation")})
                      </span>
                    )}
                  </>
                )}
              </div>
              {index < array.length - 1 && (
                <ArrowIcon className="mx-2 w-4 h-4 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }, [data.allDestinations, isRTL, t, ArrowIcon]);

  return (
    <>
      <Card className="w-full" dir={isRTL ? "rtl" : "ltr"}>
        <CardContent className="p-4 md:p-6 flex flex-col gap-2 md:gap-6 h-full">
          <div className="flex flex-col gap-2 md:justify-between">
            {data.name && (
              <div className="flex items-center flex-row gap-2">
                <MapPin className="w-4 h-4 text-main" />
                <span className="text-sm font-bold">{t("name")}:</span>
                <span className="text-sm line-clamp-1">{data.name}</span>
              </div>
            )}

            <div className="flex-row flex gap-2 items-center">
              <GroupIcon className="text-main w-4 h-4" />
              <span className="text-sm font-semibold">{t("tourType")}:</span>
              <span className="text-sm">
                {data.type ? t("individualTourType") : t("groupTourType")}
              </span>
            </div>

            {(data.startLocation || data.endLocation) && (
              <div className="flex items-center flex-row gap-2">
                <MapPin className="w-4 h-4 text-main" />
                <span className="text-sm font-bold">{t("startLocation")}:</span>
                <span className="text-sm line-clamp-1">
                  {isRTL
                    ? data.endLocation
                    : data.startLocation || "Unknown Location"}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-main" />
              <span className="text-sm font-bold">{t("startDate")}:</span>
              <span className="text-sm">{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-row items-center gap-2">
                <Wallet className="w-4 h-4 text-main" />
                <span className="text-sm font-bold">{t("price")}: </span>
                <span
                  className={`text-sm ${priceInfo.hasDiscount ? "line-through text-gray-500" : ""}`}
                >
                  {priceInfo.originalPrice} $
                </span>
                {priceInfo.hasDiscount && (
                  <span className="text-sm font-medium text-red-600">
                    {priceInfo.discountedPrice} $
                  </span>
                )}
              </div>
            </div>

            {data.numOfPersons && (
              <div className="flex-row flex gap-2 items-center">
                <PersonStanding className="text-main w-4 h-4" />
                <span className="text-sm font-semibold">
                  {t("numOfPersons")}:
                </span>
                <span className="text-sm">{data.numOfPersons}</span>
              </div>
            )}

            <div className="flex items-center gap-[3px]">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-main" />
                <span className="text-sm font-semibold">{t("duration")}:</span>
                <span className="text-sm">
                  {data.day} {t("day")}
                </span>
              </div>
              {data.night !== "0" && (
                <div className="flex items-center">
                  <span className="text-sm">
                    / {data.night} {t("night")}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-grow">
            {data.nextLocations.length > 0 && data.startLocation && (
              <>
                {/* Mobile view */}
                <div className="xl:hidden relative py-4">
                  <div className="absolute left-0 right-0 top-1/3 h-2 bg-white border-gray-300 border rounded-lg transform -translate-y-1/2" />
                  <div
                    className={`flex justify-between items-center relative ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <div className="flex flex-col items-center relative">
                      <MapPin className="w-5 h-5 text-main" />
                      <span className="text-xs font-medium text-center w-20 mt-2">
                        {data.startLocation}
                      </span>
                    </div>
                    {data.nextLocations.length > 1 && (
                      <div
                        className="flex flex-col items-center relative px-2 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handleDestinationsToggle}
                      >
                        <MoreHorizontal className="w-5 h-5 text-main z-10" />
                        <span className="text-xs font-medium text-gray-500 text-center mt-2">
                          +{data.nextLocations.length - 1} {t("stops")}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col items-center relative">
                      <MapPin className="w-5 h-5 text-main" />
                      <span className="text-xs font-medium text-center w-20 mt-2">
                        {data.endLocation}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Desktop view */}
                <div className="hidden xl:block relative py-4">
                  <div className="absolute left-0 right-0 top-1/3 h-2 bg-white border-gray-300 border rounded-lg transform -translate-y-1/2" />
                  <div
                    className={`relative flex justify-between items-center ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    {locationConfig.visibleDesktopLocations.map(
                      (location, index) => {
                        if (
                          locationConfig.showMoreOnDesktop &&
                          index === locationConfig.middleIndex
                        ) {
                          return (
                            <div key={`fragment-${index}`}>
                              <div
                                key="more-button"
                                className="flex flex-col items-center relative px-2 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={handleDestinationsToggle}
                              >
                                <MoreHorizontal className="w-5 h-5 text-main z-10" />
                                <span className="text-xs font-medium text-gray-500 text-center mt-2">
                                  +{data.allDestinations.length - 4}{" "}
                                  {t("stops")}
                                </span>
                              </div>
                              <div
                                key={`location-${index}`}
                                className="flex flex-col items-center relative"
                              >
                                <MapPin className="w-5 h-5 text-main" />
                                <span className="text-xs font-medium text-center w-20 mt-2 line-clamp-2">
                                  {location}
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div
                            key={`location-${index}`}
                            className="flex flex-col items-center relative"
                          >
                            <MapPin className="w-5 h-5 text-main" />
                            <span className="text-xs font-medium text-center w-20 mt-2 line-clamp-2">
                              {location}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </>
            )}

            {data.allDestinations.length > 0 && getDestinationsText()}

            {data.description && (
              <span
                className={cn(
                  "text-gray-600 mb-6 md:mb-8 text-sm flex-grow",
                  isRTL && "text-right"
                )}
              >
                {renderDescription(data.description)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDestinationsOpen} onOpenChange={setIsDestinationsOpen}>
        <DialogContent className="sm:max-w-md" dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>{t("tourDestinations")}</DialogTitle>
          </DialogHeader>
          <div className="relative py-6">
            <div
              className={cn(
                "absolute top-0 bottom-0 w-0.5 bg-blue-200",
                isRTL ? "right-6" : "left-6"
              )}
            />
            {(isRTL
              ? [...data.allDestinations].reverse()
              : data.allDestinations
            ).map((location, index, array) => (
              <div
                key={`destination-${index}`}
                className={cn(
                  "relative flex items-center mb-6 last:mb-0",
                  isRTL ? "flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "absolute w-4 h-4 bg-main rounded-full",
                    isRTL ? "right-6 -mr-[9px]" : "left-6 -ml-[9px]"
                  )}
                />
                <div className={isRTL ? "mr-12" : "ml-12"}>
                  <p className="text-sm font-medium">{location}</p>
                  {isRTL ? (
                    index === 0 && array.length > 1 ? (
                      <span className="text-sm main font-bold">
                        {t("endLocation")}
                      </span>
                    ) : index === array.length - 1 ? (
                      <span className="text-sm main font-bold">
                        {t("startLocation")}
                      </span>
                    ) : null
                  ) : index === 0 ? (
                    <span className="text-sm main font-bold">
                      {t("startLocation")}
                    </span>
                  ) : index === array.length - 1 && array.length > 1 ? (
                    <span className="text-sm main font-bold">
                      {t("endLocation")}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

Description.displayName = "Description";

export default Description;
