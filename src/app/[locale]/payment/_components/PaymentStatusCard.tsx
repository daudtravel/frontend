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
  completed: boolean;
  orderId: string | null;
}

const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  isLoading,
  paymentDetails,
  error,
  completed,
}) => {
  const title = completed ? "Payment Successful!" : "Payment Failed";
  const titleColor = completed ? "text-green-600" : "text-red-600";
  const icon = completed ? (
    <CheckCircle className="h-6 w-6" />
  ) : (
    <XCircle className="h-6 w-6" />
  );

  let description = "";
  if (completed) {
    description = "Congratulations! You have successfully purchased your tour.";
  } else if (paymentDetails?.reject_reason) {
    description = `Payment rejected: ${paymentDetails.reject_reason}`;
  } else if (error) {
    description = error;
  } else {
    description = "Your payment could not be processed.";
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-center text-gray-600">
              Verifying your payment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          {completed && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800 text-sm mb-2">
                You will receive tour information via email shortly.
              </p>
              <p className="text-green-800 text-sm">
                You can also check your tour details using this link:{" "}
                <a
                  href={`https://daudtravel.com/order/${paymentDetails?.id}`}
                  className="underline hover:text-green-900"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Tour Details
                </a>
              </p>
            </div>
          )}

          {!completed && paymentDetails && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 text-sm font-medium">
                Status:{" "}
                {paymentDetails.status_description || paymentDetails.status}
              </p>
            </div>
          )}

          {!completed && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-yellow-800 text-sm">
                Don t worry! No money has been charged to your account.
              </p>
            </div>
          )}

          {process.env.NODE_ENV === "development" && paymentDetails && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
              <p className="text-gray-600 text-xs font-mono">
                Debug: Status={paymentDetails.status}, Success=
                {String(paymentDetails.success)}
              </p>
            </div>
          )}

          <div className="pt-4 space-y-2">
            <Link href="/">
              <Button className="w-full">
                {completed ? "Return Home" : "Try Again"}
              </Button>
            </Link>
            <Link href={completed ? "/bookings" : "/contact"}>
              <Button variant="outline" className="w-full bg-transparent">
                {completed ? "View My Bookings" : "Contact Support"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatusCard;
