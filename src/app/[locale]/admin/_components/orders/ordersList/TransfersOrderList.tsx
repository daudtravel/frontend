"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  CalendarDays,
  MapPin,
  PersonStanding,
  Wallet,
  User,
  Phone,
  Mail,
  Clock,
  RefreshCw,
  AlertCircle,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Car,
  Route,
} from "lucide-react";

interface TransferOrderData {
  id: string;
  externalOrderId: string;
  bogOrderId: string;
  status: string;
  paymentAmount: number;
  currency: string;
  paymentUrl: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string;
  };
  transfer: {
    name: string;
    date: string;
    time: string;
    vehicleType: string;
    passengerCount: number;
    startLocation: string;
    endLocation: string;
    route: string;
  };
}

const TransferOrdersDashboard = () => {
  const [orders, setOrders] = useState<TransferOrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      // Replace with your actual API call
      // const result = await transferOrdersAPI.get();
      // For now, using the provided mock data
      const mockData = {
        success: true,
        data: [
          {
            id: "a78e3688-fcba-4b62-840c-ef08705580bd",
            externalOrderId:
              "TRANSFER_ORDER_926c849f-1a53-479f-aaac-f637bea9820f",
            bogOrderId: "0443d86d-fd0f-4e73-81b2-334b14af53e2",
            status: "completed",
            paymentAmount: 40,
            currency: "GEL",
            paymentUrl:
              "https://payment.bog.ge?order_id=0443d86d-fd0f-4e73-81b2-334b14af53e2",
            expiresAt: "2025-07-08T10:16:46.568Z",
            createdAt: "2025-07-08T09:46:46.584Z",
            updatedAt: "2025-07-08T09:47:26.704Z",
            customer: {
              firstName: "Lado",
              lastName: "Asambadze",
              fullName: "Lado Asambadze",
              email: "ladoasambadze00@gmail.com",
              phone: "555135856",
            },
            transfer: {
              name: "აეროპორტი to ქალაქი",
              date: "2025-07-08T00:00:00.000Z",
              time: "2025-07-08T09:46:30.904Z",
              vehicleType: "sedan",
              passengerCount: 3,
              startLocation: "აეროპორტი",
              endLocation: "ქალაქი",
              route: "აეროპორტი → ქალაქი",
            },
          },
          {
            id: "763b6f39-41ae-491b-8bbf-aed75c4c7fe1",
            externalOrderId:
              "TRANSFER_ORDER_da2fdc7b-782c-4bd7-8e13-e17e810d84a1",
            bogOrderId: "8e3bcf1e-d6cb-429f-ba33-d4323e8c0cbb",
            status: "completed",
            paymentAmount: 40,
            currency: "GEL",
            paymentUrl:
              "https://payment.bog.ge?order_id=8e3bcf1e-d6cb-429f-ba33-d4323e8c0cbb",
            expiresAt: "2025-07-08T10:04:39.696Z",
            createdAt: "2025-07-08T09:34:39.696Z",
            updatedAt: "2025-07-08T09:35:05.893Z",
            customer: {
              firstName: "Lado",
              lastName: "Asambadze",
              fullName: "Lado Asambadze",
              email: "lado.asambadze1@gmail.com",
              phone: "555135856",
            },
            transfer: {
              name: "აეროპორტი to ქალაქი",
              date: "2025-07-08T00:00:00.000Z",
              time: "2025-07-08T09:34:31.132Z",
              vehicleType: "sedan",
              passengerCount: 3,
              startLocation: "აეროპორტი",
              endLocation: "ქალაქი",
              route: "აეროპორტი → ქალაქი",
            },
          },
          {
            id: "80c96621-c317-4dd0-9267-9aaf1c19592a",
            externalOrderId:
              "TRANSFER_ORDER_9cb8915b-c522-4e30-a7a1-d318125a1175",
            bogOrderId: "b658c717-c60f-4141-b4ca-3dcf6235d901",
            status: "completed",
            paymentAmount: 70,
            currency: "GEL",
            paymentUrl:
              "https://payment.bog.ge?order_id=b658c717-c60f-4141-b4ca-3dcf6235d901",
            expiresAt: "2025-07-08T09:58:46.756Z",
            createdAt: "2025-07-08T09:28:46.757Z",
            updatedAt: "2025-07-08T09:29:29.495Z",
            customer: {
              firstName: "Lado",
              lastName: "Asambadze",
              fullName: "Lado Asambadze",
              email: "lado.asambadze1@gmail.com",
              phone: "555135856",
            },
            transfer: {
              name: "აეროპორტი to ქალაქი",
              date: "2025-07-08T00:00:00.000Z",
              time: "2025-07-08T09:28:38.352Z",
              vehicleType: "vito",
              passengerCount: 7,
              startLocation: "აეროპორტი",
              endLocation: "ქალაქი",
              route: "აეროპორტი → ქალაქი",
            },
          },
          {
            id: "bcc4b77c-22a4-4be0-869f-4b471b90cecc",
            externalOrderId:
              "TRANSFER_ORDER_922bcdbd-3695-4582-9c54-ae76cca5d386",
            bogOrderId: "1211ce42-7e85-4408-92a9-40ca76d49209",
            status: "pending",
            paymentAmount: 50,
            currency: "GEL",
            paymentUrl:
              "https://payment.bog.ge?order_id=1211ce42-7e85-4408-92a9-40ca76d49209",
            expiresAt: "2025-07-08T09:51:29.337Z",
            createdAt: "2025-07-08T09:21:29.354Z",
            updatedAt: "2025-07-08T09:21:29.354Z",
            customer: {
              firstName: "Lado",
              lastName: "Asambadze",
              fullName: "Lado Asambadze",
              email: "lado.asambadze1@gmail.com",
              phone: "555135856",
            },
            transfer: {
              name: "აეროპორტი to ქალაქი",
              date: "2025-07-08T00:00:00.000Z",
              time: "2025-07-08T09:21:16.291Z",
              vehicleType: "minivan",
              passengerCount: 5,
              startLocation: "აეროპორტი",
              endLocation: "ქალაქი",
              route: "აეროპორტი → ქალაქი",
            },
          },
          {
            id: "8ad3fe2e-4f61-4726-a3bb-11828d3f0e3d",
            externalOrderId:
              "TRANSFER_ORDER_356dc3ee-5f58-4aab-886b-8872560fd275",
            bogOrderId: "f6bdbd0f-3de0-4b74-9389-ce2f87256acc",
            status: "pending",
            paymentAmount: 40,
            currency: "GEL",
            paymentUrl:
              "https://payment.bog.ge?order_id=f6bdbd0f-3de0-4b74-9389-ce2f87256acc",
            expiresAt: "2025-07-08T09:38:59.731Z",
            createdAt: "2025-07-08T09:08:59.749Z",
            updatedAt: "2025-07-08T09:08:59.749Z",
            customer: {
              firstName: "Lado",
              lastName: "Asambadze",
              fullName: "Lado Asambadze",
              email: "lado.asambadze1@gmail.com",
              phone: "555135856",
            },
            transfer: {
              name: "აეროპორტი to ქალაქი",
              date: "2025-07-08T00:00:00.000Z",
              time: "2025-07-08T09:08:39.069Z",
              vehicleType: "sedan",
              passengerCount: 3,
              startLocation: "აეროპორტი",
              endLocation: "ქალაქი",
              route: "აეროპორტი → ქალაქი",
            },
          },
        ],
      };

      if (mockData.success && Array.isArray(mockData.data)) {
        setOrders(mockData.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch transfer orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "text-yellow-700 bg-yellow-50 border-yellow-200",
          icon: AlertTriangle,
          text: "PENDING",
        };
      case "completed":
        return {
          color: "text-green-700 bg-green-50 border-green-200",
          icon: CheckCircle,
          text: "COMPLETED",
        };
      case "cancelled":
        return {
          color: "text-red-700 bg-red-50 border-red-200",
          icon: XCircle,
          text: "CANCELLED",
        };
      case "failed":
        return {
          color: "text-red-700 bg-red-50 border-red-200",
          icon: XCircle,
          text: "FAILED",
        };
      default:
        return {
          color: "text-gray-700 bg-gray-50 border-gray-200",
          icon: AlertCircle,
          text: status.toUpperCase(),
        };
    }
  };

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType.toLowerCase()) {
      case "sedan":
      case "car":
        return Car;
      case "vito":
      case "minivan":
      case "van":
        return Car; // You could use a different icon for vans
      default:
        return Car;
    }
  };

  const handleDeleteFailed = async () => {
    if (!confirm("Are you sure you want to delete all failed transfer orders?"))
      return;
    try {
      setLoading(true);
      // await transferOrdersAPI.deleteFailedOrders();
      // For now, just filter out failed orders from state
      setOrders(orders.filter((order) => order.status !== "failed"));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete failed orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderOrderCard = (data: TransferOrderData) => {
    const transferDate = new Date(data.transfer.date).toLocaleDateString(
      "en-CA"
    );
    const transferTime = new Date(data.transfer.time).toLocaleTimeString(
      "en-CA",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
    const formattedExpiryDate = new Date(data.expiresAt).toLocaleString(
      "en-CA"
    );
    const statusConfig = getStatusConfig(data.status);
    const StatusIcon = statusConfig.icon;
    const VehicleIcon = getVehicleIcon(data.transfer.vehicleType);

    return (
      <Card key={data.id} className="w-full">
        <CardContent className="p-4 md:p-6 flex flex-col gap-4 h-full">
          {/* Order Header */}
          <div className="flex flex-col gap-2 border-b pb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{data.transfer.name}</h3>
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${statusConfig.color}`}
              >
                <StatusIcon className="w-3 h-3" />
                <span>{statusConfig.text}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Order ID: {data.id.slice(-8)}
            </p>
            <p className="text-sm text-gray-500">
              BOG Order: {data.bogOrderId.slice(-8)}
            </p>
          </div>

          {/* Customer Info */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm text-gray-700">
              Customer Information
            </h4>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Name:</span>
              <span className="text-sm">{data.customer.fullName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Email:</span>
              <span className="text-sm">{data.customer.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Phone:</span>
              <span className="text-sm">{data.customer.phone}</span>
            </div>
          </div>

          {/* Transfer Info */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm text-gray-700">
              Transfer Details
            </h4>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Date:</span>
              <span className="text-sm">{transferDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Time:</span>
              <span className="text-sm">{transferTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <VehicleIcon className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Vehicle:</span>
              <span className="text-sm capitalize">
                {data.transfer.vehicleType}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PersonStanding className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Passengers:</span>
              <span className="text-sm">{data.transfer.passengerCount}</span>
            </div>
          </div>

          {/* Route Information */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm text-gray-700">Route</h4>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">From:</span>
              <span className="text-sm">{data.transfer.startLocation}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium">To:</span>
              <span className="text-sm">{data.transfer.endLocation}</span>
            </div>
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Route:</span>
              <span className="text-sm">{data.transfer.route}</span>
            </div>
          </div>

          {/* Payment Information */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm text-gray-700">
              Payment Information
            </h4>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Amount:</span>
              <span className="text-sm font-semibold text-green-600">
                {data.paymentAmount} {data.currency}
              </span>
            </div>
            {data.status === "completed" && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  Payment Complete
                </span>
              </div>
            )}
          </div>

          {/* Payment Action for Pending Orders */}
          {data.status === "pending" && (
            <div className="flex flex-col gap-3 border-t pt-4">
              <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">
                    Payment Expires:
                  </span>
                  <span className="text-sm text-orange-600">
                    {formattedExpiryDate}
                  </span>
                </div>
                {data.paymentUrl && (
                  <a
                    href={data.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Complete Payment
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Order Timestamps */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">
              Order Timeline
            </h4>
            <div className="text-xs text-gray-500 space-y-1">
              <div>
                Created: {new Date(data.createdAt).toLocaleString("en-CA")}
              </div>
              <div>
                Updated: {new Date(data.updatedAt).toLocaleString("en-CA")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Transfer Orders Dashboard
        </h1>
        <div className="flex gap-2">
          <button
            onClick={fetchOrders}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={handleDeleteFailed}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Delete Failed
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading transfer orders...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Error Loading Transfer Orders
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No transfer orders found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map(renderOrderCard)}
        </div>
      )}
    </div>
  );
};

export default TransferOrdersDashboard;
