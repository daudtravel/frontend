import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const DriverSchema = z.object({
  firstname: z.string().min(1, "სახელი სავალდებულოა"),
  lastname: z.string().min(1, "გვარი სავალდებულოა"),
  image: z.string().min(1, "ფოტო სავალდებულოა"),
});

export type CreateDriverFormData = z.infer<typeof DriverSchema>;

export const useCreateDriverValidator = () => {
  return useForm<CreateDriverFormData>({
    resolver: zodResolver(DriverSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      image: "",
    },
    mode: "onChange",
  });
};

export type { DriverSchema };
