"use client";

import type React from "react";
import { useState, useCallback, useMemo } from "react";
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
import { ka, enUS, ar, tr, ru } from "date-fns/locale";
import { CalendarIcon, Plus, Minus, CreditCard } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import PaymentModal from "./TourPaymentModal";
import type { PaymentProps, BookingData, PriceData } from "./types";
import { cn } from "@/src/utlis/cn";

const localeMap = { ka, en: enUS, ar, tr, ru } as const;

const Payment: React.FC<PaymentProps> = ({ data }) => {
  const t = useTranslations("tours");
  const currentLocale = useLocale() as keyof typeof localeMap;
  const dateLocale = localeMap[currentLocale] || enUS;

  const [personCount, setPersonCount] = useState(1);
  const [paymentType, setPaymentType] = useState<"total" | "reservation">(
    "total"
  );
  const [date, setDate] = useState<Date>(new Date());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const isRTL = currentLocale === "ar";

  const isSummerSeason = useMemo(() => {
    const month = date.getMonth();
    return month >= 5 && month <= 8;
  }, [date]);

  const prices = useMemo((): PriceData => {
    if (data.type) {
      const priceData = isSummerSeason
        ? data.individualPrices?.season
        : data.individualPrices?.off_season;
      const basePrice = Number(priceData?.total_price) || 0;
      const discountedPrice = Number(priceData?.discounted_price) || 0;
      const reservationPrice = Number(priceData?.reservation_price) || 0;

      return {
        basePrice,
        discountedPrice,
        reservationPrice,
        remainingPrice: basePrice - reservationPrice,
        savings: basePrice - discountedPrice,
      };
    } else {
      const basePrice =
        (Number(data.groupPrices?.total_price) || 0) * personCount;
      const discountedPrice =
        (Number(data.groupPrices?.discounted_price) || 0) * personCount;
      const reservationPrice =
        (Number(data.groupPrices?.reservation_price) || 0) * personCount;

      return {
        basePrice,
        discountedPrice,
        reservationPrice,
        remainingPrice: basePrice - reservationPrice,
        savings: basePrice - discountedPrice,
      };
    }
  }, [data, personCount, isSummerSeason]);

  const handleIncrement = useCallback(() => {
    setPersonCount((prev) => Math.min(prev + 1, 8));
  }, []);

  const handleDecrement = useCallback(() => {
    setPersonCount((prev) => Math.max(prev - 1, 1));
  }, []);

  const handlePaymentTypeChange = useCallback((value: string) => {
    if (value === "total" || value === "reservation") {
      setPaymentType(value);
    }
  }, []);

  const handleDateSelect = useCallback((newDate: Date | undefined) => {
    setDate(newDate || new Date());
  }, []);

  const handlePayment = useCallback(() => {
    const booking: BookingData = {
      tourData: data,
      paymentType,
      personCount,
      selectedDate: date,
      prices,
    };
    setBookingData(booking);
    setShowPaymentModal(true);
  }, [data, paymentType, personCount, date, prices]);

  const closeModal = useCallback(() => {
    setShowPaymentModal(false);
  }, []);

  const paymentAmount =
    paymentType === "reservation"
      ? prices.reservationPrice
      : prices.discountedPrice || prices.basePrice;

  const PriceDisplay = useCallback(
    ({ isReservation }: { isReservation: boolean }) => (
      <div className="bg-gray-50 p-3 rounded-lg space-y-2">
        {!data.type && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t("pricePerPerson")}</span>
            <span>
              ₾ {(Number(data.groupPrices?.total_price) || 0).toFixed(2)}
            </span>
          </div>
        )}

        {isReservation ? (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t("totalAmount")}</span>
              <span>₾ {prices.basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-600">{t("payNowReservation")}</span>
              <span className="text-orange-500">
                ₾ {prices.reservationPrice.toFixed(2)}
              </span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t("payLater")}</span>
                <span>₾ {prices.remainingPrice.toFixed(2)}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t("totalAmount")}</span>
              <span
                className={
                  prices.savings > 0 ? "line-through text-gray-500" : ""
                }
              >
                ₾ {prices.basePrice.toFixed(2)}
              </span>
            </div>
            {prices.savings > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>{t("savings")}</span>
                <span>₾ {prices.savings.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{t("totalPayNow")}</span>
                <span className="text-lg font-bold text-orange-500">
                  ₾ {(prices.discountedPrice || prices.basePrice).toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    ),
    [data.type, data.groupPrices, prices, t]
  );

  const DateSelector = useCallback(
    () => (
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">
          {t("selectDate")}
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal bg-transparent"
            >
              <CalendarIcon
                className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")}
              />
              {format(date, "d MMMM yyyy", { locale: dateLocale })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
              locale={dateLocale}
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
    ),
    [date, dateLocale, handleDateSelect, isRTL, t]
  );

  const PersonCounter = useCallback(
    () => (
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
            className="h-8 w-8 bg-transparent"
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
    ),
    [personCount, handleDecrement, handleIncrement, t]
  );

  const PaymentTypeSelector = useCallback(
    ({ prefix = "" }: { prefix?: string }) => (
      <RadioGroup
        value={paymentType}
        onValueChange={handlePaymentTypeChange}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="total" id={`${prefix}option-total`} />
          <Label
            htmlFor={`${prefix}option-total`}
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
            id={`${prefix}option-reservation`}
          />
          <Label htmlFor={`${prefix}option-reservation`} className="text-sm">
            {t("reservation")}
          </Label>
        </div>
      </RadioGroup>
    ),
    [paymentType, handlePaymentTypeChange, prices.savings, t]
  );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Card dir={isRTL ? "rtl" : "ltr"}>
        <CardContent className="p-4">
          {data.type ? (
            <div className="space-y-4">
              <DateSelector />
              <PriceDisplay isReservation={paymentType === "reservation"} />
              <PaymentTypeSelector prefix="individual-" />
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handlePayment}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {paymentType === "reservation"
                  ? `${t("payReservation")} (₾${prices.reservationPrice.toFixed(2)})`
                  : `${t("payAll")} (₾${paymentAmount.toFixed(2)})`}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <DateSelector />
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <PersonCounter />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    {t("payment")}
                  </label>
                  <div className="mt-1">
                    <PaymentTypeSelector />
                  </div>
                </div>
              </div>
              <PriceDisplay isReservation={paymentType === "reservation"} />
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handlePayment}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {paymentType === "reservation"
                  ? `${t("payReservation")} (₾${prices.reservationPrice.toFixed(2)})`
                  : `${t("payAll")} (₾${prices.discountedPrice.toFixed(2)})`}
              </Button>
            </div>
          )}

          <div className="mt-4 border-t pt-4">
            <p className="text-center text-gray-600 mb-4">{t("orContactUs")}</p>
            <div className="flex flex-col gap-2">
              <Button
                asChild
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                <a href="#" target="_blank" rel="noopener noreferrer">
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
        </CardContent>
      </Card>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={closeModal}
        bookingData={bookingData}
      />
    </div>
  );
};

export default Payment;
