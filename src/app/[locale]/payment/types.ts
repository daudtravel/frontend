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
  success: boolean;
  status: string;
  external_order_id?: string;
  transaction_id?: string;
  amount?: PaymentAmount;
  status_description?: string;
  reject_reason?: string;
}
