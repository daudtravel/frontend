"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { faqApi } from "@/src/routes/faq";
import { useLocale } from "next-intl";
import {
  FaqFormData,
  SUPPORTED_LOCALES,
  useEditFaqValidator,
} from "./EditFaqValidator";
import { useQueryClient } from "@tanstack/react-query";

export function EditFaq({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const form = useEditFaqValidator();
  const locale = useLocale();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchFaqDetails = async () => {
      try {
        setIsLoading(true);
        const response = await faqApi.getById(params.id, locale);

        const faq = response.data;

        const formData: FaqFormData = {
          localizations: SUPPORTED_LOCALES.map((locale) => {
            const localization = faq.localizations.find(
              (loc: { locale: string }) => loc.locale === locale
            );

            return {
              locale,
              question: localization?.question || "",
              answer: localization?.answer || "",
            };
          }),
        };

        form.reset(formData);
      } catch (error) {
        console.error(error);
        setErrorMessage("კითხვის დეტალების ჩატვირთვა ვერ მოხერხდა");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaqDetails();
  }, [form, params.id, locale]);

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const submitData = {
        ...form.getValues(),
      };

      await faqApi.put(params.id, submitData);
      setSuccessMessage("კითხვა წარმატებით განახლდა");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      router.push("?faqs=all");
    } catch (error) {
      console.error("Error updating FAQ:", error);
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "კითხვის განახლება ვერ მოხერხდა"
        );
      } else {
        setErrorMessage("მოხდა მოულოდნელი შეცდომა");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>კითხვის რედაქტირება</CardTitle>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUPPORTED_LOCALES.map((localeCode, index) => (
                <div
                  key={localeCode}
                  className="space-y-4 p-4 border rounded-lg"
                >
                  <h3 className="text-lg font-semibold capitalize">
                    {localeCode} თარგმანი
                  </h3>

                  <FormField
                    control={form.control}
                    name={`localizations.${index}.question`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>კითხვა</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`localizations.${index}.answer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>პასუხი</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[120px]"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  იტვირთება...
                </>
              ) : (
                "განახლება"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default EditFaq;
