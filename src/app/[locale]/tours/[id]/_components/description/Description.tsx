"use client";

import renderDescription from "@/src/components/textEditor/RenderText";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  CalendarDays,
  ChevronRight,
  GroupIcon,
  MapPin,
  PersonStanding,
  Timer,
  Wallet,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import React, { useMemo } from "react";
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
    individualPrices?: {
      season?: { total_price: number; discounted_price?: number };
      off_season?: { total_price: number; discounted_price?: number };
    };
    groupPrices?: {
      total_price: number;
      discounted_price?: number;
    };
  };
}

const Description = React.memo<DescriptionProps>(({ data }) => {
  const t = useTranslations("tours");
  const currentLocale = useLocale();
  const isRTL = currentLocale === "ar";

  const isCurrentSeasonSummer = () => {
    const currentMonth = new Date().getMonth();
    return currentMonth >= 5 && currentMonth <= 8;
  };

  const priceInfo = useMemo(() => {
    if (data.type) {
      const seasonPrices = isCurrentSeasonSummer()
        ? data.individualPrices?.season
        : data.individualPrices?.off_season;

      return {
        originalPrice: seasonPrices?.total_price || 0,
        discountedPrice: seasonPrices?.discounted_price,
        hasDiscount: !!seasonPrices?.discounted_price,
      };
    }

    return {
      originalPrice: data.groupPrices?.total_price || 0,
      discountedPrice: data.groupPrices?.discounted_price,
      hasDiscount: !!data.groupPrices?.discounted_price,
    };
  }, [data.type, data.individualPrices, data.groupPrices]);

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

  const displayDestinations = isRTL
    ? [...data.allDestinations].reverse()
    : data.allDestinations;

  const InfoRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    value: string | React.ReactNode;
  }) => (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-main" />
      <span className="text-sm font-semibold">{label}:</span>
      <span className="text-sm">{value}</span>
    </div>
  );

  return (
    <>
      <Card className="w-full" dir={isRTL ? "rtl" : "ltr"}>
        <CardContent className="p-4 md:p-6 flex flex-col gap-4 h-full">
          <div className="flex flex-col gap-2">
            {data.name && (
              <InfoRow
                icon={MapPin}
                label={t("name")}
                value={<span className="line-clamp-1">{data.name}</span>}
              />
            )}

            <InfoRow
              icon={GroupIcon}
              label={t("tourType")}
              value={data.type ? t("individualTourType") : t("groupTourType")}
            />

            {(data.startLocation || data.endLocation) && (
              <InfoRow
                icon={MapPin}
                label={t("startLocation")}
                value={
                  <span className="line-clamp-1">
                    {isRTL
                      ? data.endLocation
                      : data.startLocation || "Unknown Location"}
                  </span>
                }
              />
            )}

            <InfoRow
              icon={CalendarDays}
              label={t("startDate")}
              value={formattedDate}
            />

            <InfoRow
              icon={Wallet}
              label={t("price")}
              value={
                <div className="flex items-center gap-2">
                  <span
                    className={
                      priceInfo.hasDiscount ? "line-through text-gray-500" : ""
                    }
                  >
                    {priceInfo.originalPrice} $
                  </span>
                  {priceInfo.hasDiscount && (
                    <span className="font-medium text-red-600">
                      {priceInfo.discountedPrice} ₾
                    </span>
                  )}
                </div>
              }
            />

            {data.numOfPersons && (
              <InfoRow
                icon={PersonStanding}
                label={t("numOfPersons")}
                value={data.numOfPersons.toString()}
              />
            )}

            <InfoRow
              icon={Timer}
              label={t("duration")}
              value={
                <>
                  {data.day} {t("day")}
                  {data.night !== "0" && (
                    <>
                      {" "}
                      / {data.night} {t("night")}
                    </>
                  )}
                </>
              }
            />
          </div>

          {data.allDestinations.length > 0 && (
            <div className="p-3 bg-gray-50 rounded-md">
              <h4 className="font-medium mb-2 text-sm">
                {t("tourDestinations")}:
              </h4>
              <div
                className={cn(
                  "flex flex-wrap items-center  gap-y-2",
                  isRTL && "flex-row-reverse"
                )}
              >
                {displayDestinations.map((location, index, array) => (
                  <div
                    key={`destination-${index}`}
                    className="flex items-center"
                  >
                    <span className="text-sm bg-white px-2 py-1 rounded border">
                      {location}
                    </span>
                    {index < array.length - 1 && (
                      <ChevronRight
                        className={cn(
                          "mx-2 w-4 h-4 flex-shrink-0 text-gray-400",
                          isRTL && "rotate-180"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.description && (
            <div
              className={cn(
                "text-gray-600 text-sm flex-grow",
                isRTL && "text-right"
              )}
            >
              {renderDescription(data.description)}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
});

Description.displayName = "Description";

export default Description;
