import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { format } from "date-fns";
import { ka } from "date-fns/locale"; // Import Georgian locale
import { CalendarIcon, Plus, Minus } from "lucide-react";
import { Tour } from "@/src/types/tours";
import { useTranslations } from "next-intl";
import { cn } from "@/src/utlis/cn";

const Payment = ({ data }: { data: Tour }) => {
  const t = useTranslations("tours");
  const [personCount, setPersonCount] = useState(1);
  const [paymentType, setPaymentType] = useState("total");
  const [date, setDate] = useState<Date>(new Date());

  const handleIncrement = () => {
    if (personCount < 8) setPersonCount((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (personCount > 1) setPersonCount((prev) => prev - 1);
  };

  const isDateInSummerSeason = (selectedDate: Date | undefined) => {
    if (!selectedDate) return false;
    const month = selectedDate.getMonth();
    return month >= 5 && month <= 8;
  };

  const calculateGroupPrices = () => {
    const basePrice =
      (Number(data.group_prices.total_price) ?? 0) * personCount;
    const discountedPrice =
      (Number(data.group_prices.discounted_price) ?? 0) * personCount;
    const reservationPrice =
      (Number(data.group_prices.reservation_price) ?? 0) * personCount;
    const remainingPrice = basePrice - reservationPrice;
    const savings = basePrice - discountedPrice;

    return {
      basePrice,
      discountedPrice,
      reservationPrice,
      remainingPrice,
      savings,
    };
  };

  const calculateIndividualPrices = () => {
    const isSummerSeason = isDateInSummerSeason(date);
    const priceData = isSummerSeason
      ? data.individual_prices.season
      : data.individual_prices.off_season;
    const basePrice = Number(priceData.total_price) ?? 0;
    const discountedPrice = Number(priceData.discounted_price) ?? 0;
    const reservationPrice = Number(priceData.reservation_price) ?? 0;
    const remainingPrice = basePrice - reservationPrice;
    const savings = basePrice - discountedPrice;

    return {
      basePrice,
      discountedPrice,
      reservationPrice,
      remainingPrice,
      savings,
      isSummerSeason,
    };
  };
  const prices = data.type
    ? calculateIndividualPrices()
    : calculateGroupPrices();

  const whatsappUrl = `https://wa.me/+995557442212?text=}`;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-4">
        {data.type ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                {t("selectDate")}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "d MMMM yyyy", { locale: ka })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => setDate(newDate || new Date())}
                    initialFocus
                    locale={ka}
                    classNames={{
                      day_selected: "bg-orange-500 text-white",
                      day_today: "bg-gray-100 text-orange-500 font-bold",
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="flex justify-between text-sm font-medium"></div>

              {paymentType === "total" ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t("totalAmount")}</span>
                    <span
                      className={
                        prices.savings > 0 ? "line-through text-gray-500" : ""
                      }
                    >
                      $ {prices.basePrice.toFixed(2)}
                    </span>
                  </div>
                  {prices.savings > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>{t("savings")}</span>
                      <span>$ {prices.savings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{t("totalPayNow")}</span>
                      <span className="text-lg font-bold text-orange-500">
                        ${" "}
                        {(prices.discountedPrice || prices.basePrice).toFixed(
                          2
                        )}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t("totalAmount")}</span>
                    <span>$ {prices.basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-600">
                      {t("payNowReservation")}
                    </span>
                    <span className="text-orange-500">
                      $ {prices.reservationPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t("payLater")}</span>
                      <span>$ {prices.remainingPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <RadioGroup
              value={paymentType}
              onValueChange={setPaymentType}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="total" id="individual-option-total" />
                <Label
                  htmlFor="individual-option-total"
                  className="text-sm flex items-center gap-2"
                >
                  {t("totalAmount")}
                  {prices.savings > 0 && (
                    <span className="text-red-500 font-semibold ml-1">
                      {t("discount")}
                    </span>
                  )}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="reservation"
                  id="individual-option-reservation"
                />
                <Label
                  htmlFor="individual-option-reservation"
                  className="text-sm"
                >
                  {t("reservation")}
                </Label>
              </div>
            </RadioGroup>
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => {}}
            >
              {paymentType === "reservation"
                ? `${t("payReservation")} ($${prices.reservationPrice.toFixed(2)})`
                : `${t("payAll")} ($${prices.discountedPrice.toFixed(2)})`}
            </Button>

            <div className="mt-4 border-t pt-4">
              <p className="text-center text-gray-600 mb-4">
                {t("orContactUs")}
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("contactOnWhatsapp")}
                  </a>
                </Button>
                <Button
                  asChild
                  className="w-full bg-main hover:bg-mainHover text-white"
                >
                  <a href="/contact" target="_blank" rel="noopener noreferrer">
                    {t("seeAllContactMethods")}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">
                  {t("personCount")}
                </label>
                <div className="flex items-center mt-1 space-x-2">
                  <Button
                    onClick={handleDecrement}
                    disabled={personCount <= 1}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-lg font-medium w-6 text-center">
                    {personCount}
                  </span>
                  <Button
                    onClick={handleIncrement}
                    disabled={personCount >= 8}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">
                  {t("payment")}
                </label>
                <RadioGroup
                  value={paymentType}
                  onValueChange={setPaymentType}
                  className="mt-1 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="total" id="option-total" />
                    <Label
                      htmlFor="option-total"
                      className="text-sm flex items-center gap-2"
                    >
                      {t("totalAmount")}
                      <span className="text-red-500 font-semibold ml-1">
                        {t("discount")}
                      </span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="reservation"
                      id="option-reservation"
                    />
                    <Label htmlFor="option-reservation" className="text-sm">
                      {t("reservation")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t("pricePerPerson")}</span>
                <span>
                  $ {(Number(data.group_prices.total_price) ?? 0).toFixed(2)}
                </span>
              </div>

              {paymentType === "total" ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t("totalAmount")}</span>
                    <span className="line-through text-gray-500">
                      $ {prices.basePrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>{t("savings")}</span>
                    <span>$ {prices.savings.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{t("totalPayNow")}</span>
                      <span className="text-lg font-bold text-orange-500">
                        $ {prices.discountedPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t("totalAmount")}</span>
                    <span>$ {prices.basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-600">
                      {t("payNowReservation")}
                    </span>
                    <span className="text-orange-500">
                      $ {prices.reservationPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t("payLater")}</span>
                      <span>$ {prices.remainingPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => {}}
            >
              {paymentType === "reservation"
                ? `${t("payReservation")} ($${prices.reservationPrice.toFixed(2)})`
                : `${t("payAll")} ($${prices.discountedPrice.toFixed(2)})`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Payment;
