import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const TranslationSchema = z.object({
  locale: z.string().min(1, "Locale is required"),
  name: z.string().min(1, "Start location is required"),
  start_location: z.string().min(1, "Start location is required"),
  next_location: z.array(z.string()).default([]),
  description: z.string().min(1, "Description is required"),
});

const GroupPricesSchema = z
  .object({
    total_price: z.number().optional(),
    reservation_price: z.number().optional(),
    discounted_price: z.number().optional(),
  })
  .nullable();

const IndividualPriceCategorySchema = z.object({
  total_price: z.number(),
  discounted_price: z.number(),
  reservation_price: z.number(),
});

const IndividualPricesSchema = z
  .object({
    season: IndividualPriceCategorySchema,
    off_season: IndividualPriceCategorySchema,
  })
  .nullable();

export const TourSchema = z.object({
  localizations: z
    .array(TranslationSchema)
    .min(1, "At least one localization is required"),
  day: z.string().optional(),
  night: z.string().optional(),
  amount_persons: z.number().optional(),
  group_prices: GroupPricesSchema.default(null),
  individual_prices: IndividualPricesSchema.default(null),
  type: z.boolean().default(false),
  image: z
    .string()
    .regex(/^data:image\/[a-zA-Z]+;base64,/, "Invalid image format"),
  gallery: z
    .array(
      z.string().regex(/^data:image\/[a-zA-Z]+;base64,/, "Invalid image format")
    )
    .default([]),
  public: z.boolean().default(false).optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .optional(),
});

export type TourFormData = z.infer<typeof TourSchema>;

export const useCreateTourValidator = () => {
  return useForm<TourFormData>({
    resolver: zodResolver(TourSchema),
    defaultValues: {
      localizations: [
        {
          locale: "ka",
          name: "",
          start_location: "",
          next_location: [],
          description: "",
        },
      ],
      day: "",
      night: "",
      type: false,
      group_prices: {},
      amount_persons: 0,
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
      public: false,
      image: "",
      gallery: [],
      date: new Date().toISOString().split("T")[0],
    },
    mode: "onChange",
  });
};
