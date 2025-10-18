"use client";

import { useState, useEffect, useCallback } from "react";
import { PaymentStatusResponse } from "../app/[locale]/payment/types";

export const usePaymentStatus = (orderId: string | null) => {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] =
    useState<PaymentStatusResponse | null>(null);
  const [error, setError] = useState<string>("");

  const fetchPaymentStatus = useCallback(async () => {
    if (!orderId) {
      setError("No order ID provided");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/bog/status/${orderId}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      const data: PaymentStatusResponse = await response.json();

      console.group("💳 Payment Status Debug");
      console.log("Full Response:", data);
      console.log("Status:", data?.status);
      console.log("Reject Reason:", data?.reject_reason);
      console.log("Payment Code:", data?.payment_code);
      console.log("Description:", data?.payment_code_description);
      console.groupEnd();

      if (!response.ok) {
        setError(data.message || `HTTP error: ${response.status}`);
        setPaymentDetails(data);
      } else {
        setPaymentDetails(data);

        // Explicitly check payment success/failure
        if (!data.success) {
          setError(
            data.reject_reason ||
              data.payment_code_description ||
              "Payment failed"
          );
        } else {
          console.log("✅ Payment succeeded:", data.payment_code_description);
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error verifying payment";
      setError(errorMessage);
      console.error("Payment verification error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchPaymentStatus();
  }, [fetchPaymentStatus]);

  return { isLoading, paymentDetails, error, refetch: fetchPaymentStatus };
};
