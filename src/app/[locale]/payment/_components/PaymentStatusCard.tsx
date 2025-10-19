import React from "react";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";

interface PaymentResponse {
  code?: string;
  description?: string;
  is_successful?: boolean;
}

interface PaymentStatusResponse {
  success: boolean;
  order_id: string;
  external_order_id?: string;
  status: string;
  status_description?: string;
  payment_response?: PaymentResponse;
  reject_reason?: string;
  amount?: {
    requested: number;
    transferred: number;
    refunded: number;
    currency: string;
  };
  payment_method?: string;
  transaction_id?: string;
  message?: string;
}

interface PaymentStatusCardProps {
  isLoading: boolean;
  paymentDetails: PaymentStatusResponse | null;
  error: string;
  completed: boolean;
  orderId: string | null;
}

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-white rounded-lg shadow-lg ${className}`}>{children}</div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4 border-b border-gray-200">{children}</div>
);

const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <h2 className={`text-2xl font-bold ${className}`}>{children}</h2>;

const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-gray-600 mt-2">{children}</p>
);

const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`px-6 py-4 ${className}`}>{children}</div>;

const Button = ({
  children,
  variant = "default",
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
  onClick?: () => void;
}) => {
  const baseStyles =
    "w-full py-2 px-4 rounded-md font-medium transition-colors";
  const variantStyles =
    variant === "outline"
      ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      : "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
};

const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  isLoading,
  paymentDetails,
  error,
  completed,
}) => {
  // ✅ DETERMINE SUCCESS/FAILURE CORRECTLY
  const isSuccess =
    completed &&
    paymentDetails?.status === "completed" &&
    (paymentDetails?.payment_response?.code === "100" ||
      paymentDetails?.payment_response?.is_successful);

  // ✅ GET THE MOST DETAILED ERROR MESSAGE
  const getErrorMessage = (): string => {
    // Priority 1: Payment response description (most detailed)
    if (paymentDetails?.payment_response?.description) {
      return paymentDetails.payment_response.description;
    }

    // Priority 2: Status description
    if (paymentDetails?.status_description) {
      return paymentDetails.status_description;
    }

    // Priority 3: Reject reason
    if (paymentDetails?.reject_reason) {
      const reasons: Record<string, string> = {
        expiration: "Payment expired - the order took too long to complete",
        unknown: "Payment failed due to an unknown error",
      };
      return (
        reasons[paymentDetails.reject_reason] || paymentDetails.reject_reason
      );
    }

    // Priority 4: Generic error
    if (error) {
      return error;
    }

    return "Your payment could not be processed";
  };

  const title = isSuccess ? "Payment Successful!" : "Payment Failed";
  const titleColor = isSuccess ? "text-green-600" : "text-red-600";
  const icon = isSuccess ? (
    <CheckCircle className="h-6 w-6" />
  ) : (
    <XCircle className="h-6 w-6" />
  );

  const description = isSuccess
    ? "Congratulations! You have successfully purchased your tour."
    : getErrorMessage();

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔄 LOADING STATE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-center text-gray-600">
              Verifying your payment...
            </p>
            <p className="text-center text-gray-400 text-sm mt-2">
              Please wait, this may take a few seconds
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ❌ ERROR STATE (No payment details)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (error && !paymentDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
              <Button onClick={() => (window.location.href = "/")}>
                Return Home
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/contact")}
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ✅ SUCCESS STATE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${titleColor}`}>
              {icon}
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Success Details */}
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800 text-sm mb-2">
                ✅ You will receive tour information via email shortly.
              </p>
              <p className="text-green-800 text-sm">
                📧 Check your inbox for booking confirmation.
              </p>
            </div>

            {/* Payment Details */}
            {paymentDetails && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm">
                <p className="text-blue-900 font-medium mb-2">
                  Payment Details:
                </p>
                <div className="space-y-1 text-blue-800">
                  <p>💳 Method: {paymentDetails.payment_method || "Card"}</p>
                  <p>
                    💰 Amount: {paymentDetails.amount?.requested}{" "}
                    {paymentDetails.amount?.currency}
                  </p>
                  {paymentDetails.transaction_id && (
                    <p className="text-xs">
                      🔑 Transaction: {paymentDetails.transaction_id}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 space-y-2">
              <Button onClick={() => (window.location.href = "/")}>
                Return Home
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/bookings")}
              >
                View My Bookings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ❌ FAILURE STATE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${titleColor}`}>
            {icon}
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Failure Details */}
          {paymentDetails && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 text-sm font-medium mb-2">
                Payment Status:{" "}
                {paymentDetails.status_description || paymentDetails.status}
              </p>

              {/* Show detailed failure reason */}
              {paymentDetails.payment_response?.description && (
                <div className="mt-2 pt-2 border-t border-red-200">
                  <p className="text-red-900 text-sm font-semibold">Reason:</p>
                  <p className="text-red-800 text-sm">
                    {paymentDetails.payment_response.description}
                  </p>
                </div>
              )}

              {/* Show response code for debugging */}
              {paymentDetails.payment_response?.code && (
                <p className="text-red-700 text-xs mt-2">
                  Error Code: {paymentDetails.payment_response.code}
                </p>
              )}
            </div>
          )}

          {/* Reassurance Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-yellow-800 text-sm">
              💡 Don t worry! No money has been charged to your account.
            </p>
          </div>

          {/* Common Failure Reasons Help */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
            <p className="text-gray-700 text-xs font-medium mb-2">
              Common reasons for payment failure:
            </p>
            <ul className="text-gray-600 text-xs space-y-1 list-disc list-inside">
              <li>Insufficient balance</li>
              <li>Incorrect card details (CVV, expiry date)</li>
              <li>Card declined by bank</li>
              <li>Payment limit exceeded</li>
              <li>3D Secure verification failed</li>
            </ul>
          </div>

          {/* Debug Info (Development Only) */}
          {process.env.NODE_ENV === "development" && paymentDetails && (
            <div className="bg-gray-800 border border-gray-700 rounded-md p-3">
              <p className="text-gray-300 text-xs font-mono mb-1">
                🔍 Debug Info:
              </p>
              <p className="text-gray-400 text-xs font-mono">
                Status: {paymentDetails.status}
              </p>
              <p className="text-gray-400 text-xs font-mono">
                Code: {paymentDetails.payment_response?.code || "N/A"}
              </p>
              <p className="text-gray-400 text-xs font-mono">
                Success: {String(paymentDetails.success)}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 space-y-2">
            <Button onClick={() => (window.location.href = "/")}>
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/contact")}
            >
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatusCard;
