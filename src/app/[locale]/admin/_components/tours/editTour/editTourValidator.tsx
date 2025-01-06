import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const SUPPORTED_LOCALES = ["en", "ka", "ru", "ar", "tr"] as const;

const TranslationSchema = z.object({
  locale: z.enum(SUPPORTED_LOCALES),
  name: z.string().optional(),
  destination: z.string().optional(),
  description: z.string().optional(),
});

const TourSchema = z.object({
  localizations: z.array(TranslationSchema),
  duration: z
    .number({
      invalid_type_error: "Duration must be a number",
    })
    .nonnegative("Duration must be zero or positive")
    .optional(),

  total_price: z
    .number({
      invalid_type_error: "Total price must be a number",
    })
    .nonnegative("Total price must be zero or positive")
    .optional(),

  reservation_price: z
    .number({
      invalid_type_error: "Reservation price must be a number",
    })
    .nonnegative("Reservation price must be zero or positive")
    .optional(),

  image: z.string().optional(),
  gallery: z.array(z.string()).optional(),
});

export type TourFormData = z.infer<typeof TourSchema>;

export const editTourValidator = (initialData?: Partial<TourFormData>) => {
  return useForm<TourFormData>({
    resolver: zodResolver(TourSchema),
    defaultValues: {
      localizations: SUPPORTED_LOCALES.map((locale) => ({
        locale,
        name: "",
        destination: "",
        description: "",
      })),
      duration: 0,
      total_price: 0,
      reservation_price: 0,
      image: "",
      gallery: [],
      ...initialData,
    },
    mode: "onChange",
  });
};

export type { TranslationSchema, TourSchema };
