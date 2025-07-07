"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  CalendarDays,
  MapPin,
  PersonStanding,
  Timer,
  Wallet,
  User,
  Phone,
  Mail,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { ordersAPI } from "@/src/routes/orders";

// Types
interface OrderData {
  id: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  peopleAmount: number;
  selectedDate: string;
  tourDurationDays: number;
  tourDurationNights: number;
  tourName: string;
  tourDescription?: string | null;
  startLocation?: string | null;
  endLocation?: string | null;
  locations?: string[];
  isFullPayment: boolean;
  totalTourPrice: number;
  amountPaid: number;
  externalOrderId: string;
  bogOrderId: string;
  status: string;
  paymentUrl?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderDisplayProps {
  data: OrderData;
}

const OrderDisplay = React.memo<OrderDisplayProps>(({ data }) => {
  const formattedDate = new Date(data.selectedDate).toLocaleDateString("en-CA");
  const formattedExpiryDate = new Date(data.expiresAt).toLocaleString("en-CA");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "confirmed":
        return "text-green-600 bg-green-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      case "failed":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4 md:p-6 flex flex-col gap-4 h-full">
        {/* Order Header */}
        <div className="flex flex-col gap-2 border-b pb-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">{data.tourName}</h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(data.status)}`}
            >
              {data.status.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-600 order-id">
            Order ID: {data.id.slice(-8)}
          </p>
        </div>

        {/* Customer Information */}
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-sm text-gray-700">
            Customer Information
          </h4>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Name:</span>
            <span className="text-sm">
              {data.customerFirstName} {data.customerLastName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Email:</span>
            <span className="text-sm">{data.customerEmail}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Phone:</span>
            <span className="text-sm">{data.customerPhone}</span>
          </div>
        </div>

        {/* Tour Details */}
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-sm text-gray-700">Tour Details</h4>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Tour Date:</span>
            <span className="text-sm">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <PersonStanding className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">People:</span>
            <span className="text-sm">{data.peopleAmount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Duration:</span>
            <span className="text-sm">
              {data.tourDurationDays} day{data.tourDurationDays > 1 ? "s" : ""}
              {data.tourDurationNights > 0 && (
                <>
                  {" / "}
                  {data.tourDurationNights} night
                  {data.tourDurationNights > 1 ? "s" : ""}
                </>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Total Price:</span>
            <span className="text-sm font-semibold text-green-600">
              ₾{data.totalTourPrice}
            </span>
          </div>
        </div>

        {/* Route */}
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-sm text-gray-700">Route</h4>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Start:</span>
            <span className="text-sm">
              {data.startLocation || <span className="text-gray-400">N/A</span>}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">End:</span>
            <span className="text-sm">
              {data.endLocation || <span className="text-gray-400">N/A</span>}
            </span>
          </div>
          {data.locations && data.locations.length > 0 ? (
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <h5 className="font-medium mb-2 text-sm">Tour Locations:</h5>
              <div className="flex flex-wrap items-center gap-2">
                {data.locations.map((location, index) => (
                  <div key={`location-${index}`} className="flex items-center">
                    <span className="text-sm bg-white px-2 py-1 rounded border">
                      {location}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-2 p-3 bg-gray-50 rounded-md text-gray-400 text-sm">
              No locations provided.
            </div>
          )}
        </div>

        {/* Payment Info */}
        {data.status === "pending" && (
          <div className="flex flex-col gap-3 border-t pt-4">
            <h4 className="font-semibold text-sm text-gray-700">
              Payment Information
            </h4>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">Payment Expires:</span>
              <span className="text-sm text-red-600">
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
                Complete Payment
              </a>
            )}
          </div>
        )}

        {/* Description */}
        {data.tourDescription ? (
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">
              Description
            </h4>
            <p className="text-sm text-gray-600">{data.tourDescription}</p>
          </div>
        ) : (
          <div className="border-t pt-4 text-gray-400 text-sm">
            No description provided.
          </div>
        )}
      </CardContent>
    </Card>
  );
});

OrderDisplay.displayName = "OrderDisplay";

const OrdersDashboard = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ordersAPI.get();
      if (result.success && Array.isArray(result.data)) {
        setOrders(result.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders Dashboard</h1>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading orders...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Error Loading Orders
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
          <p className="text-gray-600">No orders found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <OrderDisplay key={order.id} data={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersDashboard;
