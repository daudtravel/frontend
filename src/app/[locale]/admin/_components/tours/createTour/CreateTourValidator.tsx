import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const TranslationSchema = z.object({
  locale: z.string().min(1, "Locale is required"),
  start_location: z.string().min(1, "Start location is required"),
  next_location: z.array(z.string()).default([]),
  description: z.string().min(1, "Description is required"),
});

const GroupPricesSchema = z.object({
  total_price: z.number().optional(),
  reservation_price: z.number().optional(),
  discounted_price: z.number().optional(),
});

export const TourSchema = z.object({
  localizations: z
    .array(TranslationSchema)
    .min(1, "At least one localization is required"),
  duration: z.string().min(1, "Duration is required"),
  group_prices: GroupPricesSchema.optional(),
  type: z.boolean().default(false),
  individual_prices: z.any(),
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
          start_location: "",
          next_location: [],
          description: "",
        },
      ],
      duration: "",
      type: false,
      group_prices: {
        total_price: undefined,
        reservation_price: undefined,
        discounted_price: undefined,
      },
      individual_prices: Object.fromEntries(
        Array.from({ length: 12 }, (_, i) => [
          (i + 1).toString(),
          { per_person: {}, room_prices: {} },
        ])
      ),
      public: false,
      image: "",
      gallery: [],
      date: new Date().toISOString().split("T")[0], // Default to current date in YYYY-MM-DD format
    },
    mode: "onChange",
  });
};

export type { TranslationSchema };
