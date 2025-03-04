import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const TransfersLocalizationSchema = z.object({
  locale: z.string(),
  start_location: z.string().min(1, "საწყისი ლოკაცია სავალდებულოა"),
  end_location: z.string().min(1, "საბოლოო ლოკაცია სავალდებულოა"),
});

const PriceSchema = z.object({
  season_price: z.number().nullable(),
  off_season_price: z.number().nullable(),
});

const VehiclePricesSchema = z.object({
  sedan: PriceSchema,
  minivan: PriceSchema,
  vito: PriceSchema,
  sprinter: PriceSchema,
  bus: PriceSchema,
});

const TransfersSchema = z.object({
  localizations: z
    .array(TransfersLocalizationSchema)
    .length(1, "ლოკალიზაცია სავალდებულოა"),
  prices: VehiclePricesSchema,
});

export type CreateTransferFormData = z.infer<typeof TransfersSchema>;

export const useCreateTransferValidator = () => {
  return useForm<CreateTransferFormData>({
    resolver: zodResolver(TransfersSchema),
    defaultValues: {
      localizations: [
        {
          locale: "ka",
          start_location: "",
          end_location: "",
        },
      ],
      prices: {
        sedan: { season_price: null, off_season_price: null },
        minivan: { season_price: null, off_season_price: null },
        vito: { season_price: null, off_season_price: null },
        sprinter: { season_price: null, off_season_price: null },
        bus: { season_price: null, off_season_price: null },
      },
    },
    mode: "onChange",
  });
};

export type { TransfersSchema };
