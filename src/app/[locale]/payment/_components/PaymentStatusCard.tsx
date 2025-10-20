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
  const isSuccess =
    completed &&
    paymentDetails?.status === "completed" &&
    (paymentDetails?.payment_response?.code === "100" ||
      paymentDetails?.payment_response?.is_successful);

  const getErrorMessage = (): string => {
    if (paymentDetails?.payment_response?.description) {
      return paymentDetails.payment_response.description;
    }

    if (paymentDetails?.status_description) {
      return paymentDetails.status_description;
    }

    if (paymentDetails?.reject_reason) {
      const reasons: Record<string, string> = {
        expiration: "Payment expired - the order took too long to complete",
        unknown: "Payment failed due to an unknown error",
      };
      return (
        reasons[paymentDetails.reject_reason] || paymentDetails.reject_reason
      );
    }

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
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800 text-sm mb-2">
                ✅ You will receive tour information via email shortly.
              </p>
              <p className="text-green-800 text-sm">
                📧 Check your inbox for booking confirmation.
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <Button onClick={() => (window.location.href = "/")}>
                Return Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-yellow-800 text-sm">
              💡 Don t worry, no money has been charged to your account.
            </p>
          </div>

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
