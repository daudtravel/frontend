import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const SUPPORTED_LOCALES = ["en", "ka", "ru", "ar", "tr"] as const;

const TransfersLocalizationSchema = z.object({
  locale: z.enum(SUPPORTED_LOCALES),
  start_location: z.string().min(1, "Start location is required"),
  end_location: z.string().min(1, "End location is required"),
});

const TransfersSchema = z.object({
  localizations: z
    .array(TransfersLocalizationSchema)
    .min(1, "At least one localization is required"),
  total_price: z
    .number({
      required_error: "Total price is required",
      invalid_type_error: "Please enter a valid number",
    })
    .nonnegative("Price must be a non-negative number"),
  reservation_price: z
    .number({
      required_error: "Reservation price is required",
      invalid_type_error: "Please enter a valid number",
    })
    .nonnegative("Reservation price must be a non-negative number"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

export type TransferFormData = z.infer<typeof TransfersSchema>;

export const useEditTransferValidator = (
  initialData?: Partial<TransferFormData>
) => {
  return useForm<TransferFormData>({
    resolver: zodResolver(TransfersSchema),
    defaultValues: {
      localizations: SUPPORTED_LOCALES.map((locale) => ({
        locale,
        start_location: "",
        end_location: "",
      })),
      total_price: 0,
      reservation_price: 0,
      date: "",
      ...initialData,
    },
    mode: "onChange",
  });
};

export type { TransfersLocalizationSchema, TransfersSchema };
