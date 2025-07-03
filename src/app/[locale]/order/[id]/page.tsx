"use client";

import React, { useState, useEffect } from "react";

import { Card, CardContent } from "@/src/components/ui/card";
import {
  CalendarDays,
  ChevronRight,
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
  ArrowLeft,
} from "lucide-react";
import { useParams } from "next/navigation";

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
  tourDescription: string;
  startLocation: string;
  endLocation: string;
  locations: string[];
  isFullPayment: boolean;
  totalTourPrice: number;
  amountPaid: number;
  amountRemaining?: number;
  externalOrderId: string;
  bogOrderId: string;
  status: string;
  paymentUrl?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!id) {
      setError("Order ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${id}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Order not found");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setOrder(result.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-CA");
    } catch {
      return "Invalid Date";
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("en-CA");
    } catch {
      return "Invalid Date";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "confirmed":
        return "text-green-600 bg-green-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handleRefresh = () => {
    fetchOrder();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading order details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Error Loading Order
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="flex gap-2">
          <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Order not found.</p>
        <button className="mt-4 inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button className="inline-flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      <Card className="w-full">
        <CardContent className="p-6 flex flex-col gap-6">
          {/* Order Header */}
          <div className="flex flex-col gap-3 border-b pb-6">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">{order.tourName}</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <p>
                <strong>Order ID:</strong> {order.id}
              </p>
              <p>
                <strong>External ID:</strong> {order.externalOrderId}
              </p>
              <p>
                <strong>BOG Order ID:</strong> {order.bogOrderId}
              </p>
              <p>
                <strong>Created:</strong> {formatDateTime(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-gray-700">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Name:
                  </span>
                  <p className="text-sm">
                    {order.customerFirstName} {order.customerLastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Email:
                  </span>
                  <p className="text-sm">{order.customerEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Phone:
                  </span>
                  <p className="text-sm">{order.customerPhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tour Details */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-gray-700">
              Tour Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Tour Date:
                  </span>
                  <p className="text-sm">{formatDate(order.selectedDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PersonStanding className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    People:
                  </span>
                  <p className="text-sm">{order.peopleAmount}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Duration:
                  </span>
                  <p className="text-sm">
                    {order.tourDurationDays} day
                    {order.tourDurationDays > 1 ? "s" : ""}
                    {order.tourDurationNights > 0 && (
                      <span>
                        {" "}
                        / {order.tourDurationNights} night
                        {order.tourDurationNights > 1 ? "s" : ""}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-gray-700">
              Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Total Price:
                  </span>
                  <p className="text-sm font-semibold text-green-600">
                    ${order.totalTourPrice}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Amount Paid:
                  </span>
                  <p className="text-sm font-semibold text-green-600">
                    ${order.amountPaid}
                  </p>
                </div>
              </div>
              {order.amountRemaining && order.amountRemaining > 0 && (
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-orange-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Amount Remaining:
                    </span>
                    <p className="text-sm font-semibold text-orange-600">
                      ${order.amountRemaining}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Payment Type:
                  </span>
                  <p className="text-sm">
                    {order.isFullPayment ? "Full Payment" : "Partial Payment"}
                  </p>
                </div>
              </div>
            </div>

            {order.status === "pending" && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Payment Expires:</span>
                  <span className="text-sm text-red-600">
                    {formatDateTime(order.expiresAt)}
                  </span>
                </div>
                {order.paymentUrl && (
                  <a
                    href={order.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Complete Payment
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Route Information */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-gray-700">
              Route Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Start Location:
                  </span>
                  <p className="text-sm">{order.startLocation}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    End Location:
                  </span>
                  <p className="text-sm">{order.endLocation}</p>
                </div>
              </div>
            </div>

            {/* Locations Path */}
            {order.locations && order.locations.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h4 className="font-medium mb-3 text-sm">Tour Locations:</h4>
                <div className="flex flex-wrap items-center gap-2">
                  {order.locations.map((location, index) => (
                    <div
                      key={`location-${index}`}
                      className="flex items-center"
                    >
                      <span className="text-sm bg-white px-3 py-1 rounded border">
                        {location}
                      </span>
                      {index < order.locations.length - 1 && (
                        <ChevronRight className="mx-2 w-4 h-4 flex-shrink-0 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {order.tourDescription && (
            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg text-gray-700 mb-3">
                Description
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {order.tourDescription}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;
