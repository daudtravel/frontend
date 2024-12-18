import { gql } from "@apollo/client";

export const GET_TOURS = gql`
  query Tours($locale: I18NLocaleCode, $pagination: PaginationArg, $filters: TourFiltersInput) {
  tours(locale: $locale, pagination: $pagination, filters: $filters) {
    price
    image {
      url
      formats
    }
    documentId
    destination
    duration
    name
    reservation_price
    start_date
    
   
  }
     
}
`;

export const GET_TOURS_FILTER = gql`
  query ToursFilter($locale: I18NLocaleCode) {
    tours(locale: $locale) {
      destination
    }
  }
`;