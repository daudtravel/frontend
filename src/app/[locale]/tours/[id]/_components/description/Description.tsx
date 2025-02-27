import renderDescription from "@/src/components/textEditor/RenderText";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Tour } from "@/src/types/tours";
import {
  ArrowDown,
  CalendarDays,
  GroupIcon,
  MapPin,
  MoreHorizontal,
  PersonStanding,
  Timer,
  Wallet,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function Description({ data }: { data: Tour }) {
  const t = useTranslations("tours");
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false);
  const description =
    data.localizations?.[0]?.description || "No description available";
  const nextLocations = data.localizations[0]?.next_location || [];
  const startLocation = data.localizations[0]?.start_location;
  const endLocation =
    nextLocations.length > 0
      ? nextLocations[nextLocations.length - 1]
      : startLocation;
  const allDestinations = [startLocation, ...nextLocations];
  const day = data.day;
  const night = data.night;
  const numOfPersons = data.amount_persons;

  const isCurrentSeasonSummer = () => {
    const currentMonth = new Date().getMonth();
    return currentMonth >= 5 && currentMonth <= 8;
  };
  return (
    <>
      <Card className="w-full">
        <CardContent className="p-4 md:p-6 flex flex-col gap-2 md:gap-6 h-full">
          <div className="flex flex-col gap-2  md:justify-between">
            <div className="flex-row flex gap-2 items-center">
              <GroupIcon className="text-main w-4 h-4" />
              <span className="text-sm font-semibold">{t("tourType")}:</span>
              <span className="text-sm">
                {data.type ? t("individualTourType") : t("groupTourType")}
              </span>
            </div>

            <div className="flex items-center flex-row gap-2">
              <MapPin className="w-4 h-4 text-main" />
              <span className="text-sm font-bold">{t("startLocation")}:</span>
              <span className="text-sm line-clamp-1">
                {startLocation || "Unknown Location"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-main" />
              <span className="text-sm font-bold">{t("startDate")}:</span>
              <span className="text-sm">
                {data.type
                  ? t("agreement")
                  : new Date(data.date).toLocaleDateString("en-CA")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-row items-center gap-2">
                <Wallet className="w-4 h-4 text-main" />
                <span className="text-sm font-bold">{t("price")}: </span>
                {data.type ? (
                  <>
                    <span
                      className={`text-sm ${
                        isCurrentSeasonSummer()
                          ? data.individual_prices.season.discounted_price
                          : data.individual_prices.off_season.discounted_price
                            ? "line-through text-gray-500"
                            : ""
                      }`}
                    >
                      {isCurrentSeasonSummer()
                        ? `${data.individual_prices.season.total_price || 0} $`
                        : `${data.individual_prices.off_season.total_price || 0} $`}
                    </span>
                    {isCurrentSeasonSummer()
                      ? data.individual_prices.season.discounted_price && (
                          <span className="text-sm font-medium text-red-600">
                            {`${data.individual_prices.season.discounted_price} $`}
                          </span>
                        )
                      : data.individual_prices.off_season.discounted_price && (
                          <span className="text-sm font-medium text-red-600">
                            {`${data.individual_prices.off_season.discounted_price} $`}
                          </span>
                        )}
                  </>
                ) : (
                  <>
                    <span
                      className={`text-sm ${data.group_prices?.discounted_price ? "line-through text-gray-500" : ""}`}
                    >
                      {`${data.group_prices?.total_price || 0} $`}
                    </span>

                    {data.group_prices?.discounted_price && (
                      <span className="text-sm font-medium text-red-600">
                        {`${data.group_prices?.discounted_price} $`}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
            {data.amount_persons && (
              <div className="flex-row flex gap-2 items-center">
                <PersonStanding className="text-main w-4 h-4" />
                <span className="text-sm font-semibold">
                  {t("numOfPersons")}:
                </span>
                <span className="text-sm">{numOfPersons}</span>
              </div>
            )}
            <div className="flex items-center gap-[3px]">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-main" />
                <span className="text-sm font-semibold">{t("duration")}:</span>
                <span className="text-sm">
                  {day} {t("day")}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm">
                  / {night} {t("night")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-grow">
            {nextLocations.length > 0 && (
              <>
                <div className="xl:hidden relative py-4">
                  <div className="absolute left-0 right-0 top-1/3 h-2 bg-white border-gray-300 border rounded-lg transform -translate-y-1/2" />
                  <div className="flex justify-between items-center relative">
                    <div className="flex flex-col items-center relative">
                      <MapPin className="w-5 h-5 text-main" />
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
                      <MapPin className="w-5 h-5 text-main" />
                      <span className="text-xs font-medium text-center w-20 mt-2">
                        {endLocation}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden xl:block relative py-4">
                  <div className="absolute left-0 right-0 top-1/3 h-2 bg-white border-gray-300 border rounded-lg transform -translate-y-1/2" />
                  <div className="relative flex justify-between items-center">
                    {[startLocation, ...nextLocations].map(
                      (location, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center relative"
                        >
                          <MapPin className="w-5 h-5 text-main" />
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
            <span className="text-gray-600 mb-6 md:mb-8 text-sm flex-grow">
              {renderDescription(description)}
            </span>
          </div>
        </CardContent>
      </Card>
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
                <div className="absolute left-6 -ml-[9px] w-4 h-4 bg-main rounded-full" />

                <div className="ml-12">
                  <p className="text-sm font-medium">{location}</p>
                  {index === 0 && (
                    <span className="text-sm main font-bold">
                      {t("startLocation")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
