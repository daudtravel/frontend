import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
 
export const SUPPORTED_LOCALES = ["ka", "en", "ru", "tr", "ar"] as const;

 
const editFaqSchema = z.object({
  localizations: z.array(
    z.object({
      locale: z.string(),
      question: z.string().optional(),
      answer: z.string().optional()
    })
  ),
});

export type FaqFormData = z.infer<typeof editFaqSchema>;
 
export const useEditFaqValidator = () => {
  return useForm<FaqFormData>({
    resolver: zodResolver(editFaqSchema),
    defaultValues: {
      localizations: SUPPORTED_LOCALES.map((locale) => ({
        locale,
        question: "",
        answer: "",
      })),
    },
  });
};
