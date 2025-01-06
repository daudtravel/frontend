import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const TranslationSchema = z.object({
  locale: z.string(),
  name: z.string().min(1, "სახელი სავალდებულოა"),
  destination: z.string().min(1, "დანიშნულების ადგილი სავალდებულოა"),
  description: z.string().min(1, "აღწერა სავალდებულოა"),
});

const TourSchema = z.object({
  localizations: z
    .array(TranslationSchema)
    .length(1, "ლოკალიზაცია სავალდებულოა"),
  duration: z
    .number({
      required_error: "ხანგრძლივობა სავალდებულოა",
      invalid_type_error: "გთხოვთ შეიყვანოთ რიცხვი",
    })
    .min(0, "ხანგრძლივობა უნდა იყოს დადებითი რიცხვი"),
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
  image: z.string().min(1, "მთავარი სურათი სავალდებულოა"),
  gallery: z.array(z.string()).optional(),
});

export type TourFormData = z.infer<typeof TourSchema>;

export const createTourValidator = () => {
  return useForm<TourFormData>({
    resolver: zodResolver(TourSchema),
    defaultValues: {
      localizations: [
        {
          locale: "ka",
          name: "",
          destination: "",
          description: "",
        },
      ],
      duration: 0,
      total_price: 0,
      reservation_price: 0,
      image: "",
      gallery: [],
    },
    mode: "onChange", // This will trigger validation on change
  });
};

export type { TranslationSchema, TourSchema };
