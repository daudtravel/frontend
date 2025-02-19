import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Plus, Minus } from "lucide-react";
import { Tour } from "@/src/types/tours";
import { useTranslations } from "next-intl";
const Payment = ({ data }: { data: Tour }) => {
  const t = useTranslations("tours");
  const [personCount, setPersonCount] = useState(1);
  const [paymentType, setPaymentType] = useState("total");

  const handleIncrement = () => {
    if (personCount < 8) setPersonCount((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (personCount > 1) setPersonCount((prev) => prev - 1);
  };

  const calculatePrices = () => {
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

  const prices = calculatePrices();

  const whatsappUrl = `https://wa.me/${`+995557442212`}?text=${encodeURIComponent(
    t("whatsappMessage", { tourName: "ინდივიდუალური ტური" })
  )}`;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-4">
        {data.type ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-gray-600">{t("forIndividualTour")}</p>
            <Button
              asChild
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                {t("contactOnWhatsapp")}
              </a>
            </Button>
            <Button
              asChild
              className="w-full bg-main hoveR:bg-mainHover text-white"
            >
              <a href="/contact" target="_blank" rel="noopener noreferrer">
                {t("seeAllContactMethods")}
              </a>
            </Button>
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
                ? `Pay Reservation (₾${prices.reservationPrice.toFixed(2)})`
                : `Pay Now (₾${prices.discountedPrice.toFixed(2)})`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Payment;
