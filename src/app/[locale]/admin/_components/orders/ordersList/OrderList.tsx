"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  CalendarDays,
  PersonStanding,
  Timer,
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
} from "lucide-react";
import { ordersAPI } from "@/src/routes/orders";

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
  amountRemaining?: number;
  externalOrderId: string;
  bogOrderId: string;
  status: string;
  paymentUrl?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const OrdersDashboard = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 6,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const fetchOrders = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ordersAPI.get(page);
      if (result.success && Array.isArray(result.data)) {
        setOrders(result.data);
        if (result.pagination) {
          setPagination(result.pagination);
        }
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
    fetchOrders(pagination.currentPage);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchOrders(page);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "text-yellow-700 bg-yellow-50 border-yellow-200",
          icon: AlertTriangle,
          text: "PENDING",
        };
      case "confirmed":
        return {
          color: "text-green-700 bg-green-50 border-green-200",
          icon: CheckCircle,
          text: "CONFIRMED",
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

  const handleDeleteFailed = async () => {
    if (!confirm("Are you sure you want to delete all failed orders?")) return;
    try {
      setLoading(true);
      await ordersAPI.deleteFailedOrders();
      await fetchOrders(pagination.currentPage);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete failed orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateAmountRemaining = (order: OrderData) => {
    if (order.amountRemaining !== undefined) {
      return order.amountRemaining;
    }
    return order.totalTourPrice - order.amountPaid;
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const { totalPages, currentPage } = pagination;

    if (totalPages > 0) pageNumbers.push(1);

    if (totalPages > 5) {
      if (currentPage > 3) pageNumbers.push(-1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pageNumbers.includes(i)) pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) pageNumbers.push(-2);

      if (!pageNumbers.includes(totalPages)) pageNumbers.push(totalPages);
    } else {
      for (let i = 2; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const renderOrderCard = (data: OrderData) => {
    const formattedDate = new Date(data.selectedDate).toLocaleDateString(
      "en-CA"
    );
    const formattedExpiryDate = new Date(data.expiresAt).toLocaleString(
      "en-CA"
    );
    const statusConfig = getStatusConfig(data.status);
    const StatusIcon = statusConfig.icon;
    const amountRemaining = calculateAmountRemaining(data);

    return (
      <Card key={data.id} className="w-full">
        <CardContent className="p-4 md:p-6 flex flex-col gap-4 h-full">
          <div className="flex flex-col gap-2 border-b pb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{data.tourName}</h3>
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
          </div>

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

          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm text-gray-700">
              Tour Details
            </h4>
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
                {data.tourDurationDays} day
                {data.tourDurationDays > 1 ? "s" : ""}
                {data.tourDurationNights > 0 &&
                  ` / ${data.tourDurationNights} night${data.tourDurationNights > 1 ? "s" : ""}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Payment Type:</span>
              <span className="text-sm">
                {data.isFullPayment ? "Full Payment" : "Partial Payment"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm text-gray-700">
              Payment Information
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Total Amount:</span>
                <span className="text-sm font-semibold text-green-600">
                  ₾{data.totalTourPrice}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Amount Paid:</span>
                <span className="text-sm font-semibold text-green-600">
                  ₾{data.amountPaid}
                </span>
              </div>
              {amountRemaining > 0 && (
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Amount Remaining:</span>
                  <span className="text-sm font-semibold text-orange-600">
                    ₾{amountRemaining}
                  </span>
                </div>
              )}
              {amountRemaining === 0 && data.status === "confirmed" && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    Payment Complete
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm text-gray-700">Route</h4>

            {data.locations?.length ? (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <h5 className="font-medium mb-2 text-sm">Tour Locations:</h5>
                <div className="flex flex-wrap items-center gap-2">
                  {data.locations.map((loc, idx) => (
                    <span
                      key={idx}
                      className="text-sm bg-white px-2 py-1 rounded border"
                    >
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-2 p-3 bg-gray-50 rounded-md text-gray-400 text-sm">
                No locations provided.
              </div>
            )}
          </div>

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
                    Complete Payment
                  </a>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => fetchOrders(pagination.currentPage)}
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
            onClick={() => fetchOrders(pagination.currentPage)}
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
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map(renderOrderCard)}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
                className="px-3 py-1"
              >
                Prev
              </Button>

              {pageNumbers.map((page, index) => {
                if (page === -1 || page === -2) {
                  return (
                    <span key={`ellipsis-${index}`} className="px-3 py-1">
                      ...
                    </span>
                  );
                }
                return (
                  <Button
                    key={page}
                    variant={
                      pagination.currentPage === page ? "default" : "outline"
                    }
                    onClick={() => handlePageChange(page)}
                    className="px-3 py-1"
                  >
                    {page}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-1"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrdersDashboard;
