"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PaymentFailure() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [isChecking, setIsChecking] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!orderId) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3001/api/payments/bog/status/${orderId}`
        );
        const data = await response.json();
        setPaymentDetails(data);
        console.log("❌ Payment failed - data not saved:", data);
      } catch (err) {
        console.error("Error checking payment status:", err);
      } finally {
        setIsChecking(false);
      }
    };

    checkPaymentStatus();
  }, [orderId]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600 mb-4" />
            <p className="text-center text-gray-600">
              Checking payment status...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-6 w-6" />
            Payment Failed
          </CardTitle>
          <CardDescription>Your payment could not be processed</CardDescription>
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
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-red-600 font-semibold">
                  {paymentDetails.status_description || "Failed"}
                </span>
              </div>
              {paymentDetails.reject_reason && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Reason:</span>
                  <span className="text-red-600 text-sm">
                    {paymentDetails.reject_reason}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-yellow-800 text-sm">
              Don't worry! No money has been charged to your account.
            </p>
          </div>

          <div className="pt-4 space-y-2">
            <Link href="/">
              <Button className="w-full">Try Again</Button>
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
