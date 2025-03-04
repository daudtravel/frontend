// This should be placed in @/src/types/transfer.ts

export interface PriceInfo {
  season_price: number | null;
  off_season_price: number | null;
}

export interface VehiclePrices {
  sedan: PriceInfo;
  minivan: PriceInfo;
  vito: PriceInfo;
  sprinter: PriceInfo;
  bus: PriceInfo;
}

export interface Localization {
  locale: string;
  start_location: string;
  end_location: string;
}

export interface Transfer {
  id: string;
  localizations: Localization[];
  prices: VehiclePrices;
}