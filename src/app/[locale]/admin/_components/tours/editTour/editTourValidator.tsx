import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const SUPPORTED_LOCALES = ["en", "ka", "ru", "ar", "tr"] as const;

const LocalizationsSchema = z.object({
  locale: z.enum(SUPPORTED_LOCALES),
  name: z.string().optional(),
  start_location: z.string().optional(),
  next_location: z.array(z.string()).optional(),
  description: z.string().optional(),
});

const GroupPricesSchema = z
  .object({
    total_price: z.number().optional().nullable(),
    reservation_price: z.number().optional().nullable(),
    discounted_price: z.number().optional().nullable(),
  })
  .default({});

const IndividualPriceCategorySchema = z.object({
  total_price: z.number().nullable(),
  discounted_price: z.number().nullable(),
  reservation_price: z.number().nullable(),
});

const IndividualPricesSchema = z
  .object({
    season: IndividualPriceCategorySchema.optional(),
    off_season: IndividualPriceCategorySchema.optional(),
  })
  .default({});

const TourSchema = z.object({
  localizations: z
    .array(LocalizationsSchema)
    .min(1, "At least one localization is required"),
  day: z.string().optional(),
  night: z.string().optional(),
  group_prices: GroupPricesSchema.default({}),
  individual_prices: IndividualPricesSchema.default({}),
  amount_persons: z.number().positive().optional(),
  image: z.string().nullable(),
  gallery: z.array(z.string()).optional().nullable(),
  deleteImages: z.array(z.string()).optional().nullable(),
  public: z.boolean().default(false),
  type: z.boolean().default(false),
  daily: z.boolean().default(false),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .optional(),
});

export type TourFormData = z.infer<typeof TourSchema>;

export const useEditTourValidator = (initialData?: Partial<TourFormData>) => {
  return useForm({
    resolver: zodResolver(TourSchema),
    defaultValues: {
      localizations: SUPPORTED_LOCALES.map((locale) => ({
        locale,
        name: "",
        start_location: "",
        next_location: [],
        description: "",
      })),
      day: "",
      night: "",
      public: false,
      type: false,
      daily: false,
      group_prices: {
        total_price: null,
        reservation_price: null,
        discounted_price: null,
      },
      individual_prices: {
        season: {
          total_price: 0,
          discounted_price: 0,
          reservation_price: 0,
        },
        off_season: {
          total_price: 0,
          discounted_price: 0,
          reservation_price: 0,
        },
      },
      amount_persons: 1,
      image: null,
      date: new Date().toISOString().split("T")[0],
      gallery: [],
      deleteImages: [],
      ...initialData,
    },
    mode: "onChange",
  });
};

export type {
  LocalizationsSchema,
  IndividualPricesSchema,
  IndividualPriceCategorySchema,
};
export { TourSchema };
