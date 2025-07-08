"use client";

import { useSearchParams } from "next/navigation";
import PaymentStatusCard from "./PaymentStatusCard";
import { usePaymentStatus } from "@/src/hooks/usePaymentStatus";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { isLoading, paymentDetails, error } = usePaymentStatus(orderId);

  const isCompleted =
    paymentDetails?.success === true && paymentDetails.status === "completed";

  return (
    <PaymentStatusCard
      isLoading={isLoading}
      paymentDetails={paymentDetails}
      error={error}
      completed={isCompleted}
      orderId={orderId}
    />
  );
}
