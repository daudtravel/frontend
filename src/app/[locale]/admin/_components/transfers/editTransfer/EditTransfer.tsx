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
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  TransferFormData,

  SUPPORTED_LOCALES,
  useEditTransferValidator,
} from "./EditTransferValidator";
import { transfersAPI } from "@/src/routes/transfers";

export function EditTransfer({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const form = useEditTransferValidator();

  useEffect(() => {
    const fetchTransferDetails = async () => {
      try {
        setIsLoading(true);
        const response = await transfersAPI.getById(params.id);
        const transfer = response.data.data.transfer;

        const formData: TransferFormData = {
          localizations: SUPPORTED_LOCALES.map((locale) => ({
            locale,
            start_location: transfer.localizations[0]?.start_location || "",
            end_location: transfer.localizations[0]?.end_location || "",
          })),
          total_price: transfer.total_price,
          reservation_price: transfer.reservation_price,
          date: transfer.date,
        };

        form.reset(formData);
      } catch (error) {
        console.log(error);
        setErrorMessage("Failed to load transfer details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransferDetails();
  }, [form, params.id]);

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const submitData = {
        ...form.getValues(),
      };

      await transfersAPI.put(params.id, submitData);
      setSuccessMessage("Transfer updated successfully");
      router.push("?transfers=all");
    } catch (error) {
      console.error("Error updating transfer:", error);
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Failed to update transfer"
        );
      } else {
        setErrorMessage("An unexpected error occurred");
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
        <CardTitle>ტრანსფერის რედაქტირება</CardTitle>
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
            <div className="grid grid-cols-2 gap-4">
              {SUPPORTED_LOCALES.map((locale, index) => (
                <div key={locale} className="space-y-2 p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold capitalize">
                    {locale} თარგმანი
                  </h3>

                  <FormField
                    control={form.control}
                    name={`localizations.${index}.start_location`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Location</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`localizations.${index}.end_location`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Location</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="total_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reservation_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reservation Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Transfer"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default EditTransfer;
