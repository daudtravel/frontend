/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BookingData {
  tourData: {
    type: boolean;
    individualPrices?: any;
    groupPrices?: any;
    name?: string;
    description?: string;
    startLocation?: string;
    endLocation?: string;
    nextLocations: string[];
    allDestinations: string[];
    day: string;
    night: string;
    numOfPersons?: number;
    daily?: boolean;
    date: string;
    image?: string;
    gallery?: string[];
    tour_name?: string;
  };
  paymentType: "total" | "reservation";
  personCount: number;
  selectedDate: Date;
  prices: {
    basePrice: number;
    discountedPrice: number;
    reservationPrice: number;
    remainingPrice: number;
    savings: number;
  };
}
export interface PaymentProps {
  data: {
    type: boolean;
    individualPrices?: any;
    groupPrices?: any;
    name?: string;
    description?: string;
    startLocation?: string;
    endLocation?: string;
    nextLocations: string[];
    allDestinations: string[];
    day: string;
    night: string;
    numOfPersons?: number;
    daily?: boolean;
    date: string;
    image?: string;
    gallery?: string[];
    tour_name?: string;
  };
}

export interface BookingData {
  tourData: PaymentProps["data"];
  paymentType: "total" | "reservation";
  personCount: number;
  selectedDate: Date;
  prices: {
    basePrice: number;
    discountedPrice: number;
    reservationPrice: number;
    remainingPrice: number;
    savings: number;
  };
}

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingData | null;
}

export interface BookingData {
  tourData: PaymentProps["data"];
  paymentType: "total" | "reservation";
  personCount: number;
  selectedDate: Date;
  prices: {
    basePrice: number;
    discountedPrice: number;
    reservationPrice: number;
    remainingPrice: number;
    savings: number;
  };
}

export interface PriceData {
  basePrice: number;
  discountedPrice: number;
  reservationPrice: number;
  remainingPrice: number;
  savings: number;
}
