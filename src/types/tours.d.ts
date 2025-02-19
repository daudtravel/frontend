export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ToursQueryParams {
  start_location: string | undefined;
  isGroup: boolean | undefined;
}

export interface GetToursResponse {
  message: string;
  data: {
    tours: Tour[];
    pagination: PaginationInfo;
  };
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
  day?: string;
  night?: string;
  type: boolean;
  date: Date;
  group_prices: {
    [key: string]: {
      total_price?: number;
      reservation_price?: number;
      discounted_price?: number;
    };
  };
  individual_prices?: IndividualPrices;
  public: boolean;
  image: string;
  gallery?: string[];
  created_at: Date;
  updated_at: Date;
}

export type TourFormData = {
  localizations: { locale: string; start_location: string; next_location: string[]; description: string }[];
  day: string;
  night: string;
  type: boolean;
  group_prices: {
    [key: string]: {
      total_price?: number;
      reservation_price?: number;
      discounted_price?: number;
    };
  };
  image: string;
  gallery: string[];
  public?: boolean;
};