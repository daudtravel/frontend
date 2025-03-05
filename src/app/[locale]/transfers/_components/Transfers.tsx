"use client";

import { useQuery } from "@tanstack/react-query";
import { transfersAPI } from "@/src/routes/transfers";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import TourLoader from "@/src/components/shared/loader/TourLoader";
import { Transfer } from "@/src/types/transfer";

export const TransferBooking = () => {
  const t = useTranslations("transfers");
  const locale = useLocale();

  const {
    data: transfers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transfers", locale],
    queryFn: () => transfersAPI.get(locale),
  });

  if (isLoading) return <TourLoader />;
  if (isError)
    return (
      <div className="text-center p-4 text-red-500">
        Error loading transfer data
      </div>
    );
  if (!transfers?.data?.length)
    return <div className="text-center p-4">{t("noTransfers")}</div>;

  return (
    <div className="w-full px-4 md:px-20 pb-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center sm:text-left">
        {t("bookYourTransfer")}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {transfers.data.map((transfer: Transfer) => {
          const localization =
            transfer.localizations.find((loc) => loc.locale === locale) ||
            transfer.localizations[0];

          const availableVehicles = Object.entries(transfer.prices)
            .filter(
              ([, prices]) => prices.season_price || prices.off_season_price
            )
            .map(([vehicleType]) => vehicleType);

          return (
            <div
              key={transfer.id}
              className="border rounded-lg p-4 flex flex-col gap-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="flex flex-row  items-center gap-2 font-bold text-lg">
                  <span>{localization.start_location}</span>
                  <span className="inline mx-2">→</span>
                  <span className="block sm:inline md:mt-1 sm:mt-0">
                    <span>{localization.end_location}</span>
                  </span>
                </div>
                <Link
                  href={`/transfers/${transfer.id}`}
                  className="w-full sm:w-auto hidden md:block"
                >
                  <Button className="w-full sm:w-auto h-8">
                    {t("viewDetails")}
                  </Button>
                </Link>
              </div>

              {availableVehicles.length > 0 && (
                <div className="md:mt-4">
                  <p className="text-sm text-gray-600 mb-4 font-semibold">
                    {t("availableVehicles")}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableVehicles.map((vehicle) => (
                      <span
                        key={vehicle}
                        className="px-3 py-1 bg-gray-100 rounded-full text-xs sm:text-sm"
                      >
                        {t(vehicle)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <Link
                href={`/transfers/${transfer.id}`}
                className="w-full sm:w-auto md:hidden"
              >
                <Button className="w-full sm:w-auto h-8">
                  {t("viewDetails")}
                </Button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
