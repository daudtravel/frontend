"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { transfersAPI } from "@/src/routes/transfers";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Calendar } from "@/src/components/ui/calendar";
import { ka, enUS, ru, tr, ar } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import {
  ArrowRight,
  Calendar as CalendarIcon,
  Car,
  Clock,
  User,
  Truck,
  Bus as BusIcon,
  CreditCard,
} from "lucide-react";
import { TimePicker } from "@/src/components/shared/CustomTimePicker";
import TransferPaymentModal from "./_components/TransferPaymentModal";

interface Price {
  season_price: number | null;
  off_season_price: number | null;
}

interface PriceMap {
  [vehicleType: string]: Price;
}

interface Localization {
  locale: string;
  start_location: string;
  end_location: string;
}

interface Transfer {
  id: string;
  prices: PriceMap;
  localizations: Localization[];
}

interface TransferResponse {
  data: Transfer;
  status: string;
}

interface TransferBookingData {
  transferId: string;
  startLocation: string;
  endLocation: string;
  selectedDate: Date;
  selectedTime: Date;
  vehicleType: string;
  vehiclePrice: number;
  passengerCapacity: number;
  isSummerSeason: boolean;
}

const passengerCapacity = {
  sedan: 3,
  minivan: 5,
  vito: 7,
  sprinter: 20,
  bus: 40,
};

const vehicleIcons = {
  sedan: Car,
  minivan: Car,
  vito: Car,
  sprinter: Truck,
  bus: BusIcon,
};

const localeMap = {
  ka,
  en: enUS,
  ru,
  tr,
  ar,
};

export default function TransferDetailsPage() {
  const t = useTranslations("transfers");
  const locale = useLocale() as keyof typeof localeMap;
  const params = useParams();

  const transferId = params.id as string;

  const currentDateTime = new Date();
  const [selectedDateTime, setSelectedDateTime] = useState<{
    date: Date;
    time: Date;
  }>({
    date: currentDateTime,
    time: currentDateTime,
  });

  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { data: transferDetails } = useQuery<TransferResponse>({
    queryKey: ["transfer", transferId, locale],
    queryFn: () => transfersAPI.getById(transferId, locale),
  });

  const isSummerSeason = (date: Date): boolean => {
    const month = date.getMonth() + 1;
    return month >= 6 && month <= 9;
  };

  const getCurrentPrice = (): number | null => {
    if (!selectedVehicle || !transferDetails?.data.prices) return null;

    const vehiclePrices = transferDetails.data.prices[selectedVehicle];
    if (!vehiclePrices) return null;

    return isSummerSeason(selectedDateTime.date)
      ? vehiclePrices.season_price
      : vehiclePrices.off_season_price;
  };

  const handlePayment = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
  };

  const getBookingData = (): TransferBookingData | null => {
    if (!transferDetails?.data || !selectedVehicle || !selectedDateTime.time) {
      return null;
    }

    const transfer = transferDetails.data;
    const localization =
      transfer.localizations.find((loc) => loc.locale === locale) ||
      transfer.localizations[0];

    const currentPrice = getCurrentPrice();
    if (!currentPrice) return null;

    return {
      transferId: transfer.id,
      startLocation: localization?.start_location || "",
      endLocation: localization?.end_location || "",
      selectedDate: selectedDateTime.date,
      selectedTime: selectedDateTime.time,
      vehicleType: selectedVehicle,
      vehiclePrice: currentPrice,
      passengerCapacity:
        passengerCapacity[selectedVehicle as keyof typeof passengerCapacity] ||
        0,
      isSummerSeason: isSummerSeason(selectedDateTime.date),
    };
  };

  const transfer = transferDetails?.data;
  const localization =
    transfer?.localizations.find((loc) => loc.locale === locale) ||
    transfer?.localizations[0];

  const availableVehicles = Object.entries(transfer?.prices || {})
    .filter(([, prices]) => prices.season_price || prices.off_season_price)
    .map(([vehicleType]) => vehicleType)
    .sort((a, b) => {
      const capacityA =
        passengerCapacity[a as keyof typeof passengerCapacity] || 0;
      const capacityB =
        passengerCapacity[b as keyof typeof passengerCapacity] || 0;
      return capacityA - capacityB;
    });

  const currentPrice = getCurrentPrice();

  const renderPassengerIcons = (vehicleType: string) => {
    const capacity =
      passengerCapacity[vehicleType as keyof typeof passengerCapacity] || 0;

    if (capacity <= 3) {
      return (
        <div className="flex items-center ml-2">
          {[...Array(capacity)].map((_, i) => (
            <User key={i} className="h-4 w-4 text-gray-600" />
          ))}
        </div>
      );
    } else {
      return (
        <div className="flex items-center ml-2">
          <User className="h-4 w-4 text-gray-600" />
          <span className="text-xs text-gray-600 ml-1">x{capacity}</span>
        </div>
      );
    }
  };

  const renderVehicleIcon = (vehicleType: string) => {
    const IconComponent =
      vehicleIcons[vehicleType as keyof typeof vehicleIcons] || Car;
    return <IconComponent className="h-4 w-4 text-gray-700 mr-2" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 min-h-screen">
      <Card className="overflow-hidden border-t-2 border-t-main shadow-xl">
        <CardHeader className="bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>{t("transferDetails")}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-5">
                <span className="font-medium">
                  {localization?.start_location}
                </span>
                <ArrowRight className="h-4 w-4" />
                <span className="font-medium">
                  {localization?.end_location}
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-main" />
                <h3 className="text-lg font-medium">{t("chooseDate")}</h3>
              </div>

              <div className="border rounded-md p-2 bg-white shadow-sm">
                <Calendar
                  mode="single"
                  selected={selectedDateTime.date}
                  onSelect={(date) =>
                    setSelectedDateTime((prev) => ({
                      ...prev,
                      date: date || new Date(),
                    }))
                  }
                  className="rounded-md"
                  disabled={{ before: new Date() }}
                  locale={localeMap[locale]}
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Clock className="h-5 w-5 text-main" />
                <h3 className="text-lg font-medium">{t("selectTime")}</h3>
              </div>

              <TimePicker
                value={selectedDateTime.time}
                onChange={(time) =>
                  setSelectedDateTime((prev) => ({
                    ...prev,
                    time: time,
                  }))
                }
                placeholder={t("selectTime")}
              />

              <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                <p className="text-sm">
                  {t("selectedDate")}:{" "}
                  <span className="font-medium">
                    {selectedDateTime.date?.toLocaleDateString()}{" "}
                    {selectedDateTime.time?.toLocaleTimeString()}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-main" />
                <h3 className="text-lg font-medium">{t("chooseVehicle")}</h3>
              </div>

              <Select
                onValueChange={setSelectedVehicle}
                value={selectedVehicle}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder={t("chooseVehicle")} />
                </SelectTrigger>
                <SelectContent>
                  {availableVehicles.map((vehicle) => {
                    const price = isSummerSeason(
                      selectedDateTime.date || new Date()
                    )
                      ? transfer?.prices[vehicle].season_price
                      : transfer?.prices[vehicle].off_season_price;

                    return (
                      <SelectItem
                        key={vehicle}
                        value={vehicle}
                        className="capitalize"
                      >
                        <div className="flex justify-between w-full items-center">
                          <div className="flex items-center">
                            {renderVehicleIcon(vehicle)}
                            <span>
                              {vehicle === "sedan"
                                ? t("sedan")
                                : vehicle === "minivan"
                                  ? t("minivan")
                                  : vehicle === "vito"
                                    ? t("vito")
                                    : vehicle === "sprinter"
                                      ? t("sprinter")
                                      : vehicle === "bus"
                                        ? t("bus")
                                        : vehicle}
                            </span>
                            {renderPassengerIcons(vehicle)}
                          </div>
                          <span className="font-medium ml-2">${price}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {selectedVehicle && selectedDateTime.time && (
                <div className="mt-6 space-y-4">
                  <div className="rounded-md border overflow-hidden">
                    <div className="bg-gray-50 p-3 border-b">
                      <p className="font-medium">{t("viewDetails")}</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t("route")}:</span>
                        <span>
                          {localization?.start_location} →{" "}
                          {localization?.end_location}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t("vehicle")}:</span>
                        <div className="flex items-center">
                          {renderVehicleIcon(selectedVehicle)}
                          <span className="capitalize">
                            {selectedVehicle === "sedan"
                              ? t("sedan")
                              : selectedVehicle === "minivan"
                                ? t("minivan")
                                : selectedVehicle === "vito"
                                  ? t("vito")
                                  : selectedVehicle === "sprinter"
                                    ? t("sprinter")
                                    : selectedVehicle === "bus"
                                      ? t("bus")
                                      : selectedVehicle}
                          </span>
                          {renderPassengerIcons(selectedVehicle)}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t("date")}:</span>
                        <span>
                          {selectedDateTime.date?.toLocaleDateString()}{" "}
                          {selectedDateTime.time?.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t("capacity")}:</span>
                        <span>
                          {passengerCapacity[
                            selectedVehicle as keyof typeof passengerCapacity
                          ] || 0}{" "}
                          {t("passengers")}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>{t("total")}:</span>
                        <span>${currentPrice}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full py-3 h-12 text-base font-semibold bg-orange-500 hover:bg-orange-600 transition-all hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                    onClick={handlePayment}
                    disabled={!currentPrice || !selectedDateTime.time}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    {t("pay")} ${currentPrice}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <TransferPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handlePaymentModalClose}
        bookingData={getBookingData()}
      />
    </div>
  );
}
