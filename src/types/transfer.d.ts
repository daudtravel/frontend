interface Translation {
    locale: string;
    start_location: string;
    end_location: string;
  }
  
export interface Transfer {
    id: string;
    localizations: Translation[];
    total_price: number;
    reservation_price: number;
    date: string;
    created_at: string;
  }