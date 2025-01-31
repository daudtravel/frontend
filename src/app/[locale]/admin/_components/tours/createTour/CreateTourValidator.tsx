import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const LocalizationsSchema = z.object({
  locale: z.string(),
  start_location: z.string().min(1, "საწყისი ლოკაცია სავალდებულოა"),
  next_location: z.array(z.string()).default([]),
  description: z.string().min(1, "აღწერა სავალდებულოა"),
});

const TourSchema = z.object({
  localizations: z
    .array(LocalizationsSchema)
    .length(1, "ლოკალიზაცია სავალდებულოა"),
  duration: z.string().optional(),
  total_price: z
    .number({
      required_error: "ფასი სავალდებულოა",
      invalid_type_error: "გთხოვთ შეიყვანოთ რიცხვი",
    })
    .min(0, "ფასი უნდა იყოს დადებითი რიცხვი"),
  reservation_price: z
    .number({
      required_error: "დაჯავშნის ფასი სავალდებულოა",
      invalid_type_error: "გთხოვთ შეიყვანოთ რიცხვი",
    })
    .min(0, "დაჯავშნის ფასი უნდა იყოს დადებითი რიცხვი"),
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
      total_price: 0,
      reservation_price: 0,
      public: true,
      image: "",
      gallery: [],
    },
    mode: "onChange",
  });
};

export type { LocalizationsSchema, TourSchema };
