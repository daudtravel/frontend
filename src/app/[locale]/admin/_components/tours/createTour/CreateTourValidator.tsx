import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const LocalizationsSchema = z.object({
  locale: z.string(),
  start_location: z.string().min(1, "საწყისი ლოკაცია სავალდებულოა"),
  next_location: z.array(z.string()).default([]),
  description: z.string().min(1, "აღწერა სავალდებულოა"),
});

const PriceSchema = z.object({
  total_price: z.number().positive("Total price must be positive").optional(),
  reservation_price: z
    .number()
    .positive("Reservation price must be positive")
    .optional(),
});

const MonthlyPricesSchema = z.record(PriceSchema).optional();

const TourSchema = z.object({
  localizations: z
    .array(LocalizationsSchema)
    .length(1, "ლოკალიზაცია სავალდებულოა"),
  duration: z.string().min(1),
  prices: MonthlyPricesSchema,
  public: z.boolean().default(true),
  image: z.string().min(1, "მთავარი სურათი სავალდებულოა"),
  gallery: z.array(z.string()).optional(),
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
      prices: {},
      public: true,
      image: "",
      gallery: [],
    },
    mode: "onChange",
  });
};

export type { LocalizationsSchema, TourSchema };
