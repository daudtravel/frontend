"use client";

import type React from "react";
import { useState, useCallback, useMemo } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { CreditCard, Loader2, CheckCircle, XCircle } from "lucide-react";
import { ExtractPlainText } from "@/src/helpers/ExtractPlainText";
import { PaymentModalProps } from "./types";
import { useTranslations } from "next-intl";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  bookingData,
}) => {
  const t = useTranslations("payment");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");
  const [message, setMessage] = useState("");

  const calculations = useMemo(() => {
    if (!bookingData)
      return { paymentAmount: 0, totalTourPrice: 0, personCount: 1 };

    const personCount =
      bookingData.tourData.numOfPersons || bookingData.personCount || 1;

    const paymentAmount =
      bookingData.paymentType === "reservation"
        ? bookingData.prices.reservationPrice
        : bookingData.prices.discountedPrice || bookingData.prices.basePrice;

    const totalTourPrice =
      bookingData.paymentType === "total"
        ? bookingData.prices.discountedPrice || bookingData.prices.basePrice
        : bookingData.prices.basePrice;

    return { paymentAmount, totalTourPrice, personCount };
  }, [bookingData]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setMessage(""); // Clear previous messages on input change
      setPaymentStatus("idle");
    },
    []
  );

  const handlePhoneChange = useCallback((value: string | undefined) => {
    setFormData((prev) => ({ ...prev, phone: value || "" }));
    setMessage("");
    setPaymentStatus("idle");
  }, []);

  const validateForm = useCallback((): boolean => {
    const { firstName, lastName, email, phone } = formData;

    if (!firstName.trim()) {
      setMessage(t("firstNameRequired"));
      return false;
    }
    if (!lastName.trim()) {
      setMessage(t("lastNameRequired"));
      return false;
    }
    if (!email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      setMessage(t("emailRequired"));
      return false;
    }
    if (!phone.trim()) {
      setMessage(t("phoneRequired"));
      return false;
    }
    setMessage(""); // Clear any previous error messages
    return true;
  }, [formData, t]);

  const createPayment = useCallback(async () => {
    if (!bookingData) throw new Error(t("noBookingData"));

    const isFullPayment = bookingData.paymentType === "total";
    const tourName =
      bookingData.tourData?.tour_name ||
      bookingData.tourData?.name ||
      t("defaultTourName");

    const remainingAmount = isFullPayment
      ? undefined
      : calculations.totalTourPrice - calculations.paymentAmount;

    const allLocations = [
      ...(bookingData.tourData?.allDestinations || []),
      ...(bookingData.tourData?.nextLocations || []),
    ].filter((loc, index, arr) => arr.indexOf(loc) === index);

    const payload = {
      bookingData: {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        peopleAmount: calculations.personCount,
        selectedDate: bookingData.selectedDate,
        tourDurationDays: Number.parseInt(bookingData.tourData?.day) || 1,
        tourDurationNights: Number.parseInt(bookingData.tourData?.night) || 0,
        paymentType: isFullPayment,
        paymentAmount: calculations.paymentAmount,
        totalTourPrice: calculations.totalTourPrice,
        remainingAmount,
        tourName,
        tourDescription: ExtractPlainText(bookingData.tourData?.description),
        startLocation: bookingData.tourData?.startLocation,
        endLocation: bookingData.tourData?.endLocation,
        locations: allLocations.length > 0 ? allLocations : undefined,
      },
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/bog/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || t("httpError", { status: response.status })
      );
    }

    return response.json();
  }, [bookingData, formData, calculations, t]);

  const handleFormSubmit = useCallback(async () => {
    if (!validateForm()) {
      setPaymentStatus("failed");
      return;
    }

    setIsLoading(true);
    setPaymentStatus("processing");
    setMessage(t("creatingPayment"));

    try {
      const paymentResponse = await createPayment();

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.message || t("paymentCreationFailed"));
      }

      if (paymentResponse.paymentUrl) {
        // No message, just redirect
        window.location.href = paymentResponse.paymentUrl;
      } else {
        setPaymentStatus("success");
        setMessage(t("paymentCreatedSuccessfully"));
      }
    } catch (error) {
      setPaymentStatus("failed");
      setMessage(
        error instanceof Error ? error.message : t("paymentCreationFailed")
      );
    } finally {
      setIsLoading(false);
    }
  }, [validateForm, createPayment, t]);

  const handleClose = useCallback(() => {
    if (isLoading) return;

    setFormData({ firstName: "", lastName: "", email: "", phone: "" });
    setPaymentStatus("idle");
    setMessage("");
    onClose();
  }, [isLoading, onClose]);

  const formatAmount = useCallback(
    (amount: number) => `₾${amount.toFixed(2)}`,
    []
  );

  const statusConfig = useMemo(() => {
    switch (paymentStatus) {
      case "success":
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />,
          className: "border-green-200 bg-green-50 text-green-800",
        };
      case "failed":
        return {
          icon: <XCircle className="h-4 w-4 text-red-600 mt-0.5" />,
          className: "border-red-200 bg-red-50 text-red-800",
        };
      case "processing":
        return {
          icon: (
            <Loader2 className="h-4 w-4 animate-spin text-blue-600 mt-0.5" />
          ),
          className: "border-blue-200 bg-blue-50 text-blue-800",
        };
      default:
        return null;
    }
  }, [paymentStatus]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("modalTitle")}</DialogTitle>
          <DialogDescription>
            {t("modalDescription", {
              amount: formatAmount(calculations.paymentAmount),
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("firstName")}</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t("lastName")}</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t("phone")}</Label>
            <PhoneInput
              international
              defaultCountry="GE"
              value={formData.phone}
              onChange={handlePhoneChange}
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {message && (
            <div
              className={`mt-2 px-3 py-2 rounded border text-sm ${
                statusConfig?.className ||
                "border-gray-200 bg-gray-50 text-gray-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {statusConfig?.icon}
                <span>{message}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 bg-transparent"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleFormSubmit}
            className="flex-1 bg-orange-500 hover:bg-orange-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("processing")}
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                {t("pay", {
                  amount: formatAmount(calculations.paymentAmount),
                })}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
