import React, { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Loader2,
  CreditCard,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";

// Simplified booking data interface
interface BookingData {
  // Customer Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Booking Details
  peopleAmount: number;
  selectedDate: Date;
  tourDurationDays?: number;
  tourDurationNights?: number;

  // Payment Details
  paymentType: boolean; // true = full payment, false = reservation
  paymentAmount: number; // amount being paid now
  totalTourPrice: number; // total price of the tour (should be discounted if applicable)
  remainingAmount?: number; // amount left to pay (for reservations)

  // Tour Information
  tourName: string;
  tourDescription?: string;
  startLocation?: string;
  endLocation?: string;
  locations?: string[]; // only include if not empty
}

interface PaymentFormProps {
  bookingData: {
    tourData: any;
    paymentType: "total" | "reservation";
    personCount: number;
    selectedDate: Date;
    prices: {
      basePrice: number;
      discountedPrice: number;
      reservationPrice: number;
      remainingPrice: number;
      savings: number;
    };
  };
  onBack: () => void;
}

// Helper function to extract plain text from rich text editor format
const extractPlainText = (
  description: string | undefined
): string | undefined => {
  if (!description) return undefined;

  try {
    // Try to parse as JSON (rich text editor format)
    const parsed = JSON.parse(description);
    if (parsed.blocks && Array.isArray(parsed.blocks)) {
      const plainText = parsed.blocks
        .map((block: any) => block.text || "")
        .filter((text: string) => text.trim())
        .join(" ")
        .trim();
      return plainText || undefined;
    }
    return description.trim() || undefined;
  } catch {
    // If it's not JSON, return as plain text
    return description.trim() || undefined;
  }
};

export default function PaymentForm({ bookingData, onBack }: PaymentFormProps) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setMessage("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      setMessage("Last name is required");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setMessage("Please enter a valid email address");
      return false;
    }
    if (!formData.phone.trim()) {
      setMessage("Phone number is required");
      return false;
    }
    return true;
  };

  const getPaymentAmount = () => {
    return bookingData.paymentType === "reservation"
      ? bookingData.prices.reservationPrice
      : bookingData.prices.discountedPrice || bookingData.prices.basePrice;
  };

  const getTotalTourPrice = () => {
    // For full payment: use discounted price if available
    // For reservation: always use original base price (no discount)
    if (bookingData.paymentType === "total") {
      return bookingData.prices.discountedPrice > 0
        ? bookingData.prices.discountedPrice
        : bookingData.prices.basePrice;
    } else {
      // For reservations, always use the original base price
      return bookingData.prices.basePrice;
    }
  };

  const getActualPersonCount = () => {
    return bookingData.tourData.numOfPersons || bookingData.personCount || 1;
  };

  const createPayment = async () => {
    const actualPersonCount = getActualPersonCount();
    const paymentAmount = getPaymentAmount();
    const totalTourPrice = getTotalTourPrice();
    const isFullPayment = bookingData.paymentType === "total";

    // Debug log to see what we're working with
    console.log("🔍 Frontend booking data:", {
      tourData: bookingData.tourData,
      paymentType: bookingData.paymentType,
      prices: bookingData.prices,
      actualPersonCount,
      paymentAmount,
      totalTourPrice,
      isFullPayment,
    });

    // Get tour name with fallbacks
    const tourName =
      bookingData.tourData?.tour_name ||
      bookingData.tourData?.name ||
      bookingData.tourData?.title ||
      "Tour Booking";

    console.log("🔍 Tour name resolved to:", tourName);

    // Calculate remaining amount correctly for reservations
    const remainingAmount = isFullPayment
      ? undefined
      : totalTourPrice - paymentAmount;

    console.log("🔍 Payment calculation:", {
      totalTourPrice,
      paymentAmount,
      remainingAmount,
      isFullPayment,
      providedRemainingPrice: bookingData.prices.remainingPrice,
    });

    // Create clean booking data object
    const cleanBookingData: BookingData = {
      // Customer Information
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),

      // Booking Details
      peopleAmount: actualPersonCount,
      selectedDate: bookingData.selectedDate,
      tourDurationDays: parseInt(bookingData.tourData?.day) || 1,
      tourDurationNights: parseInt(bookingData.tourData?.night) || 0,

      // Payment Details
      paymentType: isFullPayment,
      paymentAmount: Number(paymentAmount),
      totalTourPrice: Number(totalTourPrice), // This now always uses discounted price if available
      remainingAmount: remainingAmount ? Number(remainingAmount) : undefined,

      // Tour Information (only include what's available and not empty)
      tourName: tourName,
      tourDescription: extractPlainText(bookingData.tourData?.description),
      startLocation: bookingData.tourData?.startLocation || undefined,
      endLocation: bookingData.tourData?.endLocation || undefined,
      locations: (() => {
        const allLocations = [
          ...(bookingData.tourData?.allDestinations || []),
          ...(bookingData.tourData?.nextLocations || []),
        ].filter((loc, index, arr) => arr.indexOf(loc) === index); // remove duplicates
        return allLocations.length > 0 ? allLocations : undefined;
      })(),
    };

    console.log("🔍 Clean booking data to send:", cleanBookingData);

    const payload = {
      bookingData: cleanBookingData,
    };

    const response = await fetch(
      "http://localhost:3001/api/payments/bog/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setPaymentStatus("failed");
      return;
    }

    setIsLoading(true);
    setPaymentStatus("processing");
    setMessage("Creating payment...");

    try {
      console.log("🚀 Creating BOG payment...");
      const paymentResponse = await createPayment();

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.message || "Failed to create payment");
      }

      console.log("✅ BOG Payment created successfully:", paymentResponse);
      setOrderId(
        paymentResponse.externalOrderId || paymentResponse.orderId || ""
      );
      setMessage("Redirecting to payment...");

      if (paymentResponse.paymentUrl) {
        console.log("🔄 Redirecting to BOG payment page...");
        window.location.href = paymentResponse.paymentUrl;
      } else {
        setPaymentStatus("success");
        setMessage("Payment created successfully!");
      }
    } catch (error) {
      console.error("❌ Payment creation failed:", error);
      setPaymentStatus("failed");
      setMessage(
        error instanceof Error ? error.message : "Payment creation failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return `₾${amount.toFixed(2)}`;
  };

  // Calculate remaining amount for display (using the same logic as backend)
  const getDisplayRemainingAmount = () => {
    if (bookingData.paymentType === "total") return 0;
    const totalPrice = getTotalTourPrice();
    const reservationAmount = bookingData.prices.reservationPrice;
    return totalPrice - reservationAmount;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tour Details
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Complete Your Booking
            </CardTitle>
            <CardDescription>
              Fill in your details to book this tour for{" "}
              {formatAmount(getPaymentAmount())}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {/* Customer Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    required
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
                    required
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
                  required
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
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-gray-900">Booking Summary</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Tour:</span>
                    <span className="font-medium">
                      {bookingData.tourData?.tour_name ||
                        bookingData.tourData?.name ||
                        bookingData.tourData?.title ||
                        "Tour Booking"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{formatDate(bookingData.selectedDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Participants:</span>
                    <span>{getActualPersonCount()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Tour Price:</span>
                    <span>{formatAmount(getTotalTourPrice())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Type:</span>
                    <span className="capitalize">
                      {bookingData.paymentType === "total"
                        ? "Full Payment"
                        : "Reservation"}
                    </span>
                  </div>
                  {bookingData.paymentType === "reservation" && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Remaining Amount:</span>
                      <span>{formatAmount(getDisplayRemainingAmount())}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-orange-600 border-t pt-2">
                    <span>Amount to Pay Now:</span>
                    <span>{formatAmount(getPaymentAmount())}</span>
                  </div>
                </div>
              </div>

              {/* Status Messages */}
              {message && (
                <div
                  className={`p-3 rounded-md border flex items-start gap-2 ${
                    paymentStatus === "success"
                      ? "border-green-200 bg-green-50"
                      : paymentStatus === "failed"
                        ? "border-red-200 bg-red-50"
                        : "border-blue-200 bg-blue-50"
                  }`}
                >
                  {paymentStatus === "success" && (
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  )}
                  {paymentStatus === "failed" && (
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  )}
                  {paymentStatus === "processing" && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600 mt-0.5" />
                  )}
                  <div
                    className={`text-sm ${
                      paymentStatus === "success"
                        ? "text-green-800"
                        : paymentStatus === "failed"
                          ? "text-red-800"
                          : "text-blue-800"
                    }`}
                  >
                    {message}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={isLoading || paymentStatus === "processing"}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay {formatAmount(getPaymentAmount())}
                  </>
                )}
              </Button>

              {/* Order ID Display */}
              {orderId && (
                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                  <p className="text-sm text-gray-600">
                    Order ID:{" "}
                    <span className="font-mono font-medium">{orderId}</span>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
