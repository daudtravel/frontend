import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const SUPPORTED_LOCALES = ["en", "ka", "ru", "ar", "tr"] as const;

const LocalizationsSchema = z.object({
  locale: z.enum(SUPPORTED_LOCALES),
  start_location: z.string().optional(),
  next_location: z.array(z.string()).optional(),
  description: z.string().optional(),
});

const PriceSchema = z.object({
  total_price: z.number().default(0),
  reservation_price: z.number().default(0),
});

const MonthlyPricesSchema = z.record(PriceSchema).optional();

const TourSchema = z.object({
  localizations: z
    .array(LocalizationsSchema)
    .min(1, "At least one localization is required"),
  duration: z.string().optional(),
  prices: MonthlyPricesSchema,
  image: z.string().nullable(),
  gallery: z.array(z.string()).optional().nullable(),
  deleteImages: z.array(z.string()).optional().nullable(),
  public: z.boolean().default(false),
});

export type TourFormData = z.infer<typeof TourSchema>;

export const useEditTourValidator = (initialData?: Partial<TourFormData>) => {
  return useForm<TourFormData>({
    resolver: zodResolver(TourSchema),
    defaultValues: {
      localizations: SUPPORTED_LOCALES.map((locale) => ({
        locale,
        start_location: "",
        next_location: [],
        description: "",
      })),
      duration: "",
      public: false,
      prices: {},
      image: null,
      gallery: [],
      deleteImages: [],
      ...initialData,
    },
    mode: "onChange",
  });
};

export type { LocalizationsSchema };
export { TourSchema };