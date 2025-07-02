"use client";

import { useSearchParams } from "next/navigation";
import PaymentStatusCard from "./PaymentStatusCard";
import { usePaymentStatus } from "@/src/hooks/usePaymentStatus";
 

export default function PaymentFailure() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { isLoading, paymentDetails, error } = usePaymentStatus(orderId);

  return (
    <PaymentStatusCard
      isLoading={isLoading}
      paymentDetails={paymentDetails}
      error={error}
      type="failure"
      orderId={orderId}
    />
  );
}
