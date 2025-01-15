export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetToursResponse {
  message: string;
  data: {
    tours: Tour[];
    pagination: PaginationInfo;
  };
}


export interface ToursQueryParams {
  destination: string | undefined;
  minPrice: number;
  maxPrice: number;
}

export interface Tour {
  id: string;
  localizations: {
    locale: string;
    name: string;
    destination: string;
    description: string;
  }[];
  duration: number;
  total_price: number;
  reservation_price: number;
  image: string;
  gallery: string[];
  public: boolean;
  created_at: Date;
  updated_at: Date;
}