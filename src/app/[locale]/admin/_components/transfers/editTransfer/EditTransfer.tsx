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
import { useLocale } from "next-intl";

export function EditTransfer({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const form = useEditTransferValidator();
  const locale = useLocale();

  useEffect(() => {
    const fetchTransferDetails = async () => {
      try {
        setIsLoading(true);
        const response = await transfersAPI.getById(params.id, locale);

        const transfer = response.data;

        const formData: TransferFormData = {
          localizations: SUPPORTED_LOCALES.map((locale) => ({
            locale,
            start_location:
              transfer.localizations.find(
                (loc: { locale: string }) => loc.locale === locale
              )?.start_location || "",
            end_location:
              transfer.localizations.find(
                (loc: { locale: string }) => loc.locale === locale
              )?.end_location || "",
          })),
          prices: {
            sedan: {
              season_price: transfer.prices?.sedan?.season_price || null,
              off_season_price:
                transfer.prices?.sedan?.off_season_price || null,
            },
            minivan: {
              season_price: transfer.prices?.minivan?.season_price || null,
              off_season_price:
                transfer.prices?.minivan?.off_season_price || null,
            },
            vito: {
              season_price: transfer.prices?.vito?.season_price || null,
              off_season_price: transfer.prices?.vito?.off_season_price || null,
            },
            sprinter: {
              season_price: transfer.prices?.sprinter?.season_price || null,
              off_season_price:
                transfer.prices?.sprinter?.off_season_price || null,
            },
            bus: {
              season_price: transfer.prices?.bus?.season_price || null,
              off_season_price: transfer.prices?.bus?.off_season_price || null,
            },
          },
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

  const vehicleTypes = ["sedan", "minivan", "vito", "sprinter", "bus"] as const;

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

            <div className="p-4 border rounded-lg space-y-4">
              <h3 className="text-lg font-semibold">Prices by Vehicle Type</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicleTypes.map((vehicleType) => (
                  <div key={vehicleType} className="p-3 border rounded-md">
                    <h4 className="font-medium capitalize mb-2">
                      {vehicleType}
                    </h4>

                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name={`prices.${vehicleType}.season_price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Season Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value === null ? "" : field.value}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? null
                                      : Number(e.target.value);
                                  field.onChange(value);
                                }}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`prices.${vehicleType}.off_season_price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Off-Season Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value === null ? "" : field.value}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? null
                                      : Number(e.target.value);
                                  field.onChange(value);
                                }}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
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
