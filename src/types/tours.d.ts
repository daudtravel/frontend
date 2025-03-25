export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ToursQueryParams {
  start_location: string | undefined;
  isGroup: boolean | undefined;
  page: number;
  limit: number;
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
  name?: string;
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
  amount_persons?: number;
  daily: string;
}





export interface TourFormData {
  localizations: {
    locale: string;
    start_location?: string;
    next_location?: string[];
    description?: string;
  }[];
  day?: string;
  night?: string;
  group_prices?: {
    total_price?: number;
    reservation_price?: number;
    discounted_price?: number;
  };
  individual_prices?: {
    season: {
      total_price?: number;
      discounted_price?: number;
      individual_price?: number;
    };
    off_season: {
      total_price?: number;
      discounted_price?: number;
      individual_price?: number;
    };
  };
  type?: boolean;
  date?: string;
  image: string;
  gallery?: string[];
  amount_persons?: number;
}