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

const TourSchema = z.object({
  localizations: z
    .array(LocalizationsSchema)
    .min(1, "At least one localization is required"),
  duration: z.string().optional(),
  individual_prices: z.any(),
  group_prices: z.any(),
  image: z.string().nullable(),
  gallery: z.array(z.string()).optional().nullable(),
  deleteImages: z.array(z.string()).optional().nullable(),
  public: z.boolean().default(false),
  type: z.boolean().default(false),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .optional(),
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
      image: null,
      date: new Date().toISOString().split("T")[0],
      gallery: [],
      deleteImages: [],
      ...initialData,
    },
    mode: "onChange",
  });
};

export type { LocalizationsSchema };
export { TourSchema };
