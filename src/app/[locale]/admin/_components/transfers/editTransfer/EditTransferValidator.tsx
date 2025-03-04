import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const SUPPORTED_LOCALES = ["en", "ka", "ru", "ar", "tr"] as const;

const TransfersLocalizationSchema = z.object({
  locale: z.enum(SUPPORTED_LOCALES),
  start_location: z.string().min(1, "Start location is required"),
  end_location: z.string().min(1, "End location is required"),
});

const PriceSchema = z.object({
  season_price: z.number().nullable(),
  off_season_price: z.number().nullable(),
});

const VehiclePricesSchema = z.object({
  sedan: PriceSchema,
  minivan: PriceSchema,
  vito: PriceSchema,
  sprinter: PriceSchema,
  bus: PriceSchema,
});

const TransfersSchema = z.object({
  localizations: z
    .array(TransfersLocalizationSchema)
    .min(1, "At least one localization is required"),
  prices: VehiclePricesSchema,
});

export type TransferFormData = z.infer<typeof TransfersSchema>;

export const useEditTransferValidator = (
  initialData?: Partial<TransferFormData>
) => {
  return useForm<TransferFormData>({
    resolver: zodResolver(TransfersSchema),
    defaultValues: {
      localizations: SUPPORTED_LOCALES.map((locale) => ({
        locale,
        start_location: "",
        end_location: "",
      })),
      prices: {
        sedan: { season_price: null, off_season_price: null },
        minivan: { season_price: null, off_season_price: null },
        vito: { season_price: null, off_season_price: null },
        sprinter: { season_price: null, off_season_price: null },
        bus: { season_price: null, off_season_price: null },
      },
      ...initialData,
    },
    mode: "onChange",
  });
};

export type { TransfersLocalizationSchema };
