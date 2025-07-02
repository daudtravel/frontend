export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface TourData {
  name: string;
  type: string;
  description: string;
  startLocation?: string;
  endLocation?: string;
  nextLocations?: string[];
  allDestinations?: string[];
  day: number;
  night: number;
  numOfPersons?: number;
  daily: boolean;
  date: Date;
  image: string;
  gallery?: string[];
  individualPrices?: {
    adult: number;
    child: number;
  };
  groupPrices?: {
    small: number;
    medium: number;
    large: number;
  };
}

export interface BookingPrices {
  basePrice: number;
  discountedPrice?: number;
  reservationPrice: number;
  remainingPrice: number;
}

export interface BookingData {
  tourData: TourData;
  selectedDate: Date;
  personCount: number;
  paymentType: "total" | "reservation";
  prices: BookingPrices;
}

export interface PaymentFormProps {
  bookingData: BookingData;
  onBack: () => void;
}

export interface SubmitTourData extends CustomerData {
  people_amount: number;
  choosed_date: Date;
  payment_type: boolean;
  payment_amount: number;
  rest_payment?: number;
  tour_name: string;
  tour_type: string;
  type: string;
  name: string;
  description: string;
  startLocation?: string;
  endLocation?: string;
  nextLocations?: string[];
  allDestinations?: string[];
  day: number;
  night: number;
  numOfPersons?: number;
  daily: boolean;
  date: Date;
  image: string;
  gallery: string[];
  individualPrices?: {
    adult: number;
    child: number;
  };
  groupPrices?: {
    small: number;
    medium: number;
    large: number;
  };
}

export interface PaymentResponse {
  success: boolean;
  message?: string;
  external_order_id?: string;
  order_id?: string;
  payment_url?: string;
  data?: any;
}

export type PaymentStatus = "idle" | "processing" | "success" | "failed";
