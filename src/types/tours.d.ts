interface TourLocalization {
  locale: string;
  name: string;
  destination: string;
  description: string;
}

interface Tour {
  id: string;
  localizations: TourLocalization[];
  duration?: number;
  total_price?: number;
  reservation_price?: number;
  image?: string;
  gallery?: string[];
}


interface ApiResponse {
  data: {
    tours: Tour[];
  };
  error?: string;
}