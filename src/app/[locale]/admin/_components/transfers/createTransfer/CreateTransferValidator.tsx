import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const TransfersLocalizationSchema = z.object({
  locale: z.string(),
  start_location: z.string().min(1, "სახელი სავალდებულოა"),
  end_location: z.string().min(1, "დანიშნულების ადგილი სავალდებულოა"),
});

const TransfersSchema = z.object({
  localizations: z
    .array(TransfersLocalizationSchema)
    .length(1, "ლოკალიზაცია სავალდებულოა"),
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
  date: z.string(),
});

export type TransferFormData = z.infer<typeof TransfersSchema>;

export const useCreateTransferValidator = () => {
  return useForm<TransferFormData>({
    resolver: zodResolver(TransfersSchema),
    defaultValues: {
      localizations: [
        {
          locale: "ka",
          start_location: "",
          end_location: "",
        },
      ],
      total_price: 0,
      reservation_price: 0,
      date: "",
    },
    mode: "onChange",
  });
};

export type { TransfersSchema };
