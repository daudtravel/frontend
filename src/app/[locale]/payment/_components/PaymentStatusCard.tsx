"use client";

import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { PaymentStatusResponse } from "../types";

interface PaymentStatusCardProps {
  isLoading: boolean;
  paymentDetails: PaymentStatusResponse | null;
  error: string;
  type: "success" | "failure";
  orderId: string | null;
}

const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  isLoading,
  paymentDetails,
  error,
  type,
  orderId,
}) => {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-center text-gray-600">
              {type === "success"
                ? "Verifying your payment..."
                : "Checking payment status..."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle API errors (no payment details)
  if (error && !paymentDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-6 w-6" />
              Verification Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Link href="/">
                <Button className="w-full">Return Home</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="w-full bg-transparent">
                  Contact Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine payment status
  const isActuallyPaid = paymentDetails?.is_actually_paid === true;
  const isSuccess = type === "success" && isActuallyPaid;

  // Handle case where backend returns success=false but we have payment details
  const backendSuccess = paymentDetails?.success === true;
  const finalSuccess = isSuccess && backendSuccess;

  const icon = finalSuccess ? (
    <CheckCircle className="h-6 w-6" />
  ) : (
    <XCircle className="h-6 w-6" />
  );

  const titleColor = finalSuccess ? "text-green-600" : "text-red-600";
  const title = finalSuccess ? "Payment Successful!" : "Payment Failed";

  let description = "";
  if (finalSuccess) {
    description = "Your payment has been processed successfully";
  } else if (type === "success" && !isActuallyPaid) {
    description = "Payment verification failed - no money was charged";
  } else if (paymentDetails?.reject_reason) {
    description = `Payment rejected: ${paymentDetails.reject_reason}`;
  } else if (paymentDetails?.note) {
    description = paymentDetails.note;
  } else {
    description = "Your payment could not be processed";
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${titleColor}`}>
            {icon}
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentDetails && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-sm">
                  {paymentDetails.external_order_id || orderId}
                </span>
              </div>
              {paymentDetails.amount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">
                    {paymentDetails.amount.transferred}{" "}
                    {paymentDetails.amount.currency}
                  </span>
                </div>
              )}
              {finalSuccess && paymentDetails.transaction_id && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-sm">
                    {paymentDetails.transaction_id}
                  </span>
                </div>
              )}
              {paymentDetails.customer_name && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span>{paymentDetails.customer_name}</span>
                </div>
              )}
              {paymentDetails.tour_name && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tour:</span>
                  <span>{paymentDetails.tour_name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`font-semibold ${finalSuccess ? "text-green-600" : "text-red-600"}`}
                >
                  {finalSuccess
                    ? "Completed"
                    : paymentDetails.status_description || "Failed"}
                </span>
              </div>
              {paymentDetails.payment_code && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Code:</span>
                  <span className="font-mono text-sm">
                    {paymentDetails.payment_code} -{" "}
                    {paymentDetails.payment_code_description}
                  </span>
                </div>
              )}
              {paymentDetails.source && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Source:</span>
                  <span className="text-sm capitalize">
                    {paymentDetails.source.replace("_", " ")}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Show error message if there's an error but we have payment details */}
          {error && paymentDetails && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-yellow-800 text-sm">{error}</p>
            </div>
          )}

          {!finalSuccess && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-yellow-800 text-sm">
                {"Don't worry! No money has been charged to your account."}
              </p>
            </div>
          )}

          <div className="pt-4 space-y-2">
            <Link href="/">
              <Button className="w-full">
                {finalSuccess ? "Return Home" : "Try Again"}
              </Button>
            </Link>
            <Link href={finalSuccess ? "/bookings" : "/contact"}>
              <Button variant="outline" className="w-full bg-transparent">
                {finalSuccess ? "View My Bookings" : "Contact Support"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatusCard;
