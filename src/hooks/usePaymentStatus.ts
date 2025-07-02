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
      const response = await fetch(
        `http://localhost:3001/api/payments/bog/status/${orderId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PaymentStatusResponse = await response.json();
      setPaymentDetails(data);
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
