
  
  
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
    created_at: Date;
    updated_at: Date;
  }