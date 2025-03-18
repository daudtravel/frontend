"use client";

import { useState } from "react";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { faqApi } from "@/src/routes/faq";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/src/components/ui/textarea";

// Define the validation schema
const createFaqSchema = z.object({
  localizations: z.array(
    z.object({
      locale: z.string().default("ka"),
      question: z.string().min(3, {
        message: "კითხვა უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს",
      }),
      answer: z.string().min(3, {
        message: "პასუხი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს",
      }),
    })
  ),
});

type CreateFaqFormData = z.infer<typeof createFaqSchema>;

// Custom hook for form validation
export const useCreateFaqValidator = () => {
  return useForm<CreateFaqFormData>({
    resolver: zodResolver(createFaqSchema),
    defaultValues: {
      localizations: [
        {
          locale: "ka",
          question: "",
          answer: "",
        },
      ],
    },
  });
};

const CreateFaq = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const form = useCreateFaqValidator();
  const queryClient = useQueryClient();
  const params = useParams();
  const locale = params.locale as string;

  const onSubmit = async (data: CreateFaqFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      await faqApi.post(data);
      console.log(data);
      setSuccessMessage("კითხვა წარმატებით შეიქმნა");
      await queryClient.invalidateQueries({ queryKey: ["faqs", locale] });
      form.reset();
      router.push(`?faqs=all`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || "An error occurred";
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage("მოულოდნელი შეცდომა. გთხოვთ სცადოთ თავიდან");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>ახალი კითხვის დამატება</CardTitle>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {successMessage}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="localizations.0.question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>კითხვა</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="შეიყვანეთ კითხვა"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="localizations.0.answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>პასუხი</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="შეიყვანეთ პასუხი"
                      className="min-h-[120px]"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  იტვირთება...
                </>
              ) : (
                "კითხვის დამატება"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateFaq;
