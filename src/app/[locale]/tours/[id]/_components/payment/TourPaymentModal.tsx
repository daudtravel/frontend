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

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  bookingData,
}) => {
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
  const [orderId, setOrderId] = useState("");

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
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    const { firstName, lastName, email, phone } = formData;

    if (!firstName.trim()) {
      setMessage("First name is required");
      return false;
    }
    if (!lastName.trim()) {
      setMessage("Last name is required");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      setMessage("Please enter a valid email address");
      return false;
    }
    if (!phone.trim()) {
      setMessage("Phone number is required");
      return false;
    }
    return true;
  }, [formData]);

  const createPayment = useCallback(async () => {
    if (!bookingData) throw new Error("No booking data available");

    const isFullPayment = bookingData.paymentType === "total";
    const tourName =
      bookingData.tourData?.tour_name ||
      bookingData.tourData?.name ||
      "Tour Booking";
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
      "https://api.daudtravel.com/api/payments/bog/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }, [bookingData, formData, calculations]);

  const handleFormSubmit = useCallback(async () => {
    if (!validateForm()) {
      setPaymentStatus("failed");
      return;
    }

    setIsLoading(true);
    setPaymentStatus("processing");
    setMessage("Creating payment...");

    try {
      const paymentResponse = await createPayment();

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.message || "Failed to create payment");
      }

      setOrderId(
        paymentResponse.externalOrderId || paymentResponse.orderId || ""
      );
      setMessage("Redirecting to payment...");

      if (paymentResponse.paymentUrl) {
        window.location.href = paymentResponse.paymentUrl;
      } else {
        setPaymentStatus("success");
        setMessage("Payment created successfully!");
      }
    } catch (error) {
      setPaymentStatus("failed");
      setMessage(
        error instanceof Error ? error.message : "Payment creation failed"
      );
    } finally {
      setIsLoading(false);
    }
  }, [validateForm, createPayment]);

  const handleClose = useCallback(() => {
    if (isLoading) return;

    setFormData({ firstName: "", lastName: "", email: "", phone: "" });
    setPaymentStatus("idle");
    setMessage("");
    setOrderId("");
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
          <DialogTitle>Complete Your Booking</DialogTitle>
          <DialogDescription>
            Fill in your details to proceed with payment of{" "}
            {formatAmount(calculations.paymentAmount)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john.doe@example.com"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+995 555 123 456"
              disabled={isLoading}
            />
          </div>

          {message && statusConfig && (
            <div
              className={`p-3 rounded-md border flex items-start gap-2 ${statusConfig.className}`}
            >
              {statusConfig.icon}
              <div className="text-sm">{message}</div>
            </div>
          )}

          {orderId && (
            <div className="p-3 bg-gray-100 rounded-md">
              <p className="text-sm text-gray-600">
                Order ID:{" "}
                <span className="font-mono font-medium">{orderId}</span>
              </p>
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
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            className="flex-1 bg-orange-500 hover:bg-orange-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay {formatAmount(calculations.paymentAmount)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
