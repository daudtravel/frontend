export interface PaymentAmount {
  transferred: number;
  currency: string;
}

export interface PaymentDetails {
  success: boolean;
  status: string;
  external_order_id: string;
  transaction_id: string;
  amount: PaymentAmount;
  status_description?: string;
  reject_reason?: string;
}

export interface PaymentStatusResponse {
  id: any;
  success: boolean;
  order_id: string;
  external_order_id: string;
  status: string;
  status_description: string;
  is_actually_paid: boolean;
  amount: {
    requested: number;
    transferred: number;
    refunded: number;
    currency: string;
  };
  payment_method?: string;
  payment_code?: string;
  payment_code_description?: string;
  transaction_id?: string;
  completed_at?: string;
  customer_name?: string;
  tour_name?: string;
  reject_reason?: string;
  source: "database" | "bog_api";
  note?: string;
  message?: string; // For error responses
  error?: string; // For error responses
}
