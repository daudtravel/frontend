export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ToursQueryParams {
  start_location: string | undefined;
  minPrice: number;
  maxPrice: number;
}

export interface GetToursResponse {
  message: string;
  data: {
    tours: Tour[];
    pagination: PaginationInfo;
  };
}

export interface RoomPrices {
  "1"?: number;
  "2"?: number;
  "3"?: number;
  "4"?: number;
  "5"?: number;
}

export interface PersonPrices {
  "1"?: number;
  "2"?: number;
  "3"?: number;
  "4"?: number;
  "5"?: number;
  "6"?: number;
}

export interface MonthlyPriceConfig {
  per_person: PersonPrices;
  room_prices: RoomPrices;
}

export interface GroupPrice {
  total_price?: number;
  reservation_price?: number;
  discounted_price?: number;
}

export interface GroupPrices {
  "1"?: GroupPrice;
  "2"?: GroupPrice;
  "3"?: GroupPrice;
  "4"?: GroupPrice;
  "5"?: GroupPrice;
  "6"?: GroupPrice;
  "7"?: GroupPrice;
  "8"?: GroupPrice;
  "9"?: GroupPrice;
  "10"?: GroupPrice;
  "11"?: GroupPrice;
  "12"?: GroupPrice;
}

export interface IndividualPrices {
  "1"?: MonthlyPriceConfig;
  "2"?: MonthlyPriceConfig;
  "3"?: MonthlyPriceConfig;
  "4"?: MonthlyPriceConfig;
  "5"?: MonthlyPriceConfig;
  "6"?: MonthlyPriceConfig;
  "7"?: MonthlyPriceConfig;
  "8"?: MonthlyPriceConfig;
  "9"?: MonthlyPriceConfig;
  "10"?: MonthlyPriceConfig;
  "11"?: MonthlyPriceConfig;
  "12"?: MonthlyPriceConfig;
}

export interface Localization {
  locale: string;
  start_location?: string;
  next_location?: string[];
  description?: string;
}

export interface Tour {
  id: string;
  localizations: Localization[];
  duration?: string;
  type: boolean;
  group_prices?: GroupPrices;
  individual_prices?: IndividualPrices;
  public: boolean;
  image: string;
  gallery?: string[];
  created_at: Date;
  updated_at: Date;
}

export type TourFormData = {
  localizations: { locale: string; start_location: string; next_location: string[]; description: string }[];
  duration: string;
  type: boolean;
  group_prices: {
    [key: string]: {
      total_price?: number;
      reservation_price?: number;
      discounted_price?: number;
    };
  };
  individual_prices: {
    [key: string]: {
      per_person: {
        [key: string]: number | undefined;
      };
      room_prices: {
        [key: string]: number | undefined;
      };
    };
  };
  image: string;
  gallery: string[];
  public?: boolean;
};