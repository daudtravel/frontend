export interface FilterValues {
    start_location?: string;
    isGroup?: boolean;
  }
  
export   interface TourFiltersProps {
    urlStartLocation?: string;
    initialIsGroup?: boolean;
    filtersData?: { data?: { tours?: Tour[] } };
    isLoading: boolean;
    onSearch: (filters: FilterValues) => void;
    onReset: () => void;
    className?: string;
    isMobile?: boolean;
    onClose?: () => void;
  }