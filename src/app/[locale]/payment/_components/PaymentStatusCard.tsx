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
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { PaymentStatusResponse } from "../types";

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

  if (error && type === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Verification Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/">
              <Button className="w-full">Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSuccess = type === "success";
  const icon = isSuccess ? (
    <CheckCircle className="h-6 w-6" />
  ) : (
    <XCircle className="h-6 w-6" />
  );
  const titleColor = isSuccess ? "text-green-600" : "text-red-600";
  const title = isSuccess ? "Payment Successful!" : "Payment Failed";
  const description = isSuccess
    ? "Your payment has been processed successfully"
    : "Your payment could not be processed";

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

              {isSuccess && paymentDetails.amount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">
                    {paymentDetails.amount.transferred}{" "}
                    {paymentDetails.amount.currency}
                  </span>
                </div>
              )}

              {isSuccess && paymentDetails.transaction_id && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-sm">
                    {paymentDetails.transaction_id}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`font-semibold ${isSuccess ? "text-green-600" : "text-red-600"}`}
                >
                  {isSuccess
                    ? "Completed"
                    : paymentDetails.status_description || "Failed"}
                </span>
              </div>

              {!isSuccess && paymentDetails.reject_reason && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Reason:</span>
                  <span className="text-red-600 text-sm">
                    {paymentDetails.reject_reason}
                  </span>
                </div>
              )}
            </div>
          )}

          {!isSuccess && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-yellow-800 text-sm">
                {"Don't worry! No money has been charged to your account."}
              </p>
            </div>
          )}

          <div className="pt-4 space-y-2">
            <Link href="/">
              <Button className="w-full">
                {isSuccess ? "Return Home" : "Try Again"}
              </Button>
            </Link>
            <Link href={isSuccess ? "/bookings" : "/contact"}>
              <Button variant="outline" className="w-full bg-transparent">
                {isSuccess ? "View My Bookings" : "Contact Support"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatusCard;
