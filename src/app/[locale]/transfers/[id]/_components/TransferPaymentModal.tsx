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
import { Card, CardContent } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import {
  CreditCard,
  Loader2,
  CheckCircle,
  XCircle,
  User,
  MapPin,
  Calendar,
  Clock,
  Car,
  Truck,
  Bus as BusIcon,
  ArrowRight,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";

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

interface TransferPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: TransferBookingData | null;
}

const vehicleIcons = {
  sedan: Car,
  minivan: Car,
  vito: Car,
  sprinter: Truck,
  bus: BusIcon,
};

const vehicleNames = {
  sedan: "Sedan",
  minivan: "Minivan",
  vito: "Mercedes Vito",
  sprinter: "Mercedes Sprinter",
  bus: "Bus",
};

const TransferPaymentModal: React.FC<TransferPaymentModalProps> = ({
  isOpen,
  onClose,
  bookingData,
}) => {
  const t = useTranslations("transfers");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");
  const [message, setMessage] = useState("");

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setMessage("");
      setPaymentStatus("idle");
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
    if (!email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      setMessage("Valid email is required");
      return false;
    }
    if (!phone.trim()) {
      setMessage("Phone number is required");
      return false;
    }
    setMessage("");
    return true;
  }, [formData]);

  const createPayment = useCallback(async () => {
    if (!bookingData) throw new Error("No booking data available");

    const payload = {
      bookingData: {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        passengerCount: bookingData.passengerCapacity,
        transferDate: bookingData.selectedDate,
        transferTime: bookingData.selectedTime,
        vehicleType: bookingData.vehicleType,
        transferName: `${bookingData.startLocation} to ${bookingData.endLocation}`,
        startLocation: bookingData.startLocation,
        endLocation: bookingData.endLocation,
        paymentAmount: bookingData.vehiclePrice,
        specialRequests: formData.specialRequests.trim(),
      },
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/bog/transfer/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Payment failed with status ${response.status}`
      );
    }

    return response.json();
  }, [bookingData, formData]);

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
        throw new Error(paymentResponse.message || "Payment creation failed");
      }

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

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialRequests: "",
    });
    setPaymentStatus("idle");
    setMessage("");
    onClose();
  }, [isLoading, onClose]);

  const formatAmount = useCallback(
    (amount: number) => `$${amount.toFixed(2)}`,
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

  const renderVehicleIcon = (vehicleType: string) => {
    const IconComponent =
      vehicleIcons[vehicleType as keyof typeof vehicleIcons] || Car;
    return <IconComponent className="h-4 w-4 text-gray-500" />;
  };

  const renderBookingSummary = () => {
    if (!bookingData) return null;

    return (
      <Card className="mb-6 border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-orange-800">
              Transfer Details
            </h3>
            <span className="text-sm text-orange-600 font-medium">
              {bookingData.isSummerSeason ? "Summer Season" : "Off Season"}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-orange-600" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-orange-800 font-medium">
                  {bookingData.startLocation}
                </span>
                <ArrowRight className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-orange-800 font-medium">
                  {bookingData.endLocation}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-800">
                {bookingData.selectedDate.toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-800">
                {bookingData.selectedTime.toLocaleTimeString()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-orange-600">
                {renderVehicleIcon(bookingData.vehicleType)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-orange-800 font-medium">
                  {
                    vehicleNames[
                      bookingData.vehicleType as keyof typeof vehicleNames
                    ]
                  }
                </span>
                <span className="text-xs text-orange-600">
                  ({bookingData.passengerCapacity} passengers)
                </span>
              </div>
            </div>

            <Separator className="bg-orange-200" />

            <div className="flex justify-between items-center">
              <span className="font-semibold text-orange-800">Total</span>
              <span className="text-xl font-bold text-orange-600">
                {formatAmount(bookingData.vehiclePrice)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-orange-800">
              Complete Your Booking
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isLoading}
              className="h-8 w-8 rounded-full hover:bg-orange-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-600">
            Please fill in your details to complete the transfer booking for{" "}
            {bookingData ? formatAmount(bookingData.vehiclePrice) : "$0.00"}
          </DialogDescription>
        </DialogHeader>

        {renderBookingSummary()}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name *
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={isLoading}
                className="focus:border-orange-500 focus:ring-orange-500"
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name *
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={isLoading}
                className="focus:border-orange-500 focus:ring-orange-500"
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              className="focus:border-orange-500 focus:ring-orange-500"
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number *
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={isLoading}
              className="focus:border-orange-500 focus:ring-orange-500"
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests" className="text-sm font-medium">
              Special Requests (Optional)
            </Label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              placeholder="Any special requests or notes for your transfer..."
            />
          </div>

          {message && (
            <div
              className={`mt-4 px-4 py-3 rounded-md border text-sm ${
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

        <DialogFooter className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
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
                Pay{" "}
                {bookingData ? formatAmount(bookingData.vehiclePrice) : "$0.00"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransferPaymentModal;
