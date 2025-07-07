"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";

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
  CreditCard,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/src/utlis/cn";

interface OrderData {
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
  const t = useTranslations("tours");
  const currentLocale = useLocale();
  const isRTL = currentLocale === "ar";

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!id) {
      setError(t("orderNotFound"));
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
          throw new Error(t("orderNotFound"));
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
      setError(err instanceof Error ? err.message : t("errorLoadingOrder"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const formatDate = useCallback(
    (dateString: string) => {
      const localeMap = {
        ka: "ka-GE",
        ar: "ar-SA",
        ru: "ru-RU",
        tr: "tr-TR",
      };

      try {
        return new Date(dateString).toLocaleDateString(
          localeMap[currentLocale as keyof typeof localeMap] || "en-CA"
        );
      } catch {
        return "Invalid Date";
      }
    },
    [currentLocale]
  );

  const formatDateTime = useCallback(
    (dateString: string) => {
      const localeMap = {
        ka: "ka-GE",
        ar: "ar-SA",
        ru: "ru-RU",
        tr: "tr-TR",
      };

      try {
        return new Date(dateString).toLocaleString(
          localeMap[currentLocale as keyof typeof localeMap] || "en-CA"
        );
      } catch {
        return "Invalid Date";
      }
    },
    [currentLocale]
  );

  const statusConfig = useMemo(() => {
    switch (order?.status) {
      case "pending":
        return {
          color: "text-yellow-700 bg-yellow-50 border-yellow-200",
          icon: AlertTriangle,
          text: t("statusPending"),
        };
      case "confirmed":
        return {
          color: "text-green-700 bg-green-50 border-green-200",
          icon: CheckCircle,
          text: t("statusConfirmed"),
        };
      case "cancelled":
        return {
          color: "text-red-700 bg-red-50 border-red-200",
          icon: XCircle,
          text: t("statusCancelled"),
        };
      default:
        return {
          color: "text-gray-700 bg-gray-50 border-gray-200",
          icon: AlertCircle,
          text: order?.status?.toUpperCase() || "UNKNOWN",
        };
    }
  }, [order?.status, t]);

  const locationConfig = useMemo(() => {
    if (!order?.locations) return null;

    const MAX_VISIBLE_LOCATIONS = 5;
    const allLocations = [order.startLocation, ...order.locations];
    const totalLocations = allLocations.length;
    const showMore = totalLocations > MAX_VISIBLE_LOCATIONS;

    const visibleLocations = showMore
      ? [
          allLocations[0],
          allLocations[1],
          allLocations[totalLocations - 2],
          allLocations[totalLocations - 1],
        ]
      : allLocations;

    const hiddenCount = showMore ? totalLocations - 4 : 0;

    return {
      showMore,
      visibleLocations,
      hiddenCount,
      allLocations,
      totalLocations,
    };
  }, [order?.locations, order?.startLocation]);

  const handleRefresh = useCallback(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-main" />
        <span className="ml-2 text-gray-600">{t("loadingOrderDetails")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          {t("errorLoadingOrder")}
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-main text-white rounded-md hover:bg-main/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const StatusIcon = statusConfig.icon;

  return (
    <div
      className="container mx-auto p-4 md:p-6 max-w-4xl"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            {t("orderDetails")}
          </h1>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-4 py-2 bg-main text-white rounded-md hover:bg-main/90 transition-colors"
        >
          <RefreshCw className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
          {t("refresh")}
        </button>
      </div>

      <Card className="w-full">
        <CardContent className="p-4 md:p-6 flex flex-col gap-4 md:gap-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 pb-4 border-b">
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                {order.tourName}
              </h2>
            </div>
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border",
                statusConfig.color
              )}
            >
              <StatusIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{statusConfig.text}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-main" />
              <span className="text-sm font-bold">
                {t("customerInformation")}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-main" />
                <span className="text-sm font-semibold">{t("name")}:</span>
                <span className="text-sm">
                  {order.customerFirstName} {order.customerLastName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-main" />
                <span className="text-sm font-semibold">{t("email")}:</span>
                <span className="text-sm">{order.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-main" />
                <span className="text-sm font-semibold">{t("phone")}:</span>
                <span className="text-sm">{order.customerPhone}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-main" />
              <span className="text-sm font-bold">{t("tourDetails")}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-main" />
                <span className="text-sm font-semibold">{t("startDate")}:</span>
                <span className="text-sm">
                  {formatDate(order.selectedDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PersonStanding className="w-4 h-4 text-main" />
                <span className="text-sm font-semibold">
                  {t("personCount")}:
                </span>
                <span className="text-sm">{order.peopleAmount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-main" />
                <span className="text-sm font-semibold">{t("duration")}:</span>
                <span className="text-sm">
                  {order.tourDurationDays} {t("day")}
                  {order.tourDurationNights > 0 && (
                    <span>
                      {" "}
                      / {order.tourDurationNights} {t("night")}
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-main" />
                <span className="text-sm font-semibold">
                  {t("paymentType")}:
                </span>
                <span className="text-sm">
                  {order.isFullPayment ? t("fullPayment") : t("partialPayment")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-main" />
              <span className="text-sm font-bold">
                {t("paymentInformation")}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-main" />
                <span className="text-sm font-semibold">
                  {t("totalAmount")}:
                </span>
                <span className="text-sm font-semibold text-green-600">
                  ₾{order.totalTourPrice}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-main" />
                <span className="text-sm font-semibold">
                  {t("amountPaid")}:
                </span>
                <span className="text-sm font-semibold text-green-600">
                  ₾{order.amountPaid}
                </span>
              </div>
              {order.amountRemaining && order.amountRemaining > 0 && (
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-semibold">
                    {t("amountRemaining")}:
                  </span>
                  <span className="text-sm font-semibold text-orange-600">
                    ${order.amountRemaining}
                  </span>
                </div>
              )}
            </div>

            {order.status === "pending" && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-700">
                    {t("paymentExpires")}:
                  </span>
                  <span className="text-sm text-orange-600">
                    {formatDateTime(order.expiresAt)}
                  </span>
                </div>
                {order.paymentUrl && (
                  <a
                    href={order.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-main text-white rounded-md hover:bg-main/90 transition-colors text-sm font-medium"
                  >
                    {t("completePayment")}
                  </a>
                )}
              </div>
            )}
          </div>

          {locationConfig && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-main" />
                <span className="text-sm font-bold">
                  {t("routeInformation")}
                </span>
              </div>

              <div className="md:hidden">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-main" />
                  <span className="text-sm font-semibold">
                    {t("startLocation")}:
                  </span>
                  <span className="text-sm">{order.startLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-main" />
                  <span className="text-sm font-semibold">
                    {t("endLocation")}:
                  </span>
                  <span className="text-sm">{order.endLocation}</span>
                </div>
              </div>

              {order.locations && order.locations.length > 0 && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-2 text-sm">
                    {t("tourDestinations")}:
                  </h4>
                  <div
                    className={cn(
                      "flex flex-wrap items-center gap-y-2",
                      isRTL ? "flex-row-reverse" : ""
                    )}
                  >
                    {locationConfig.allLocations.map(
                      (location, index, array) => (
                        <div
                          key={`destination-${index}`}
                          className="flex items-center"
                        >
                          <span className="text-sm bg-white px-2 py-1 rounded border">
                            {location}
                          </span>
                          {index < array.length - 1 && (
                            <ChevronRight
                              className={cn(
                                "mx-2 w-4 h-4 flex-shrink-0 text-gray-400",
                                isRTL && "rotate-180"
                              )}
                            />
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {order.tourDescription && (
            <div className="border-t pt-4">
              <span
                className={cn(
                  "text-gray-600 text-sm leading-relaxed",
                  isRTL && "text-right"
                )}
              >
                {order.tourDescription}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;
