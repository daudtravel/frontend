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
import {
  CreateTransferFormData,
  useCreateTransferValidator,
} from "./CreateTransferValidator";
import { transfersAPI } from "@/src/routes/transfers";
import { useQueryClient } from "@tanstack/react-query";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";

const CreateTransfer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const form = useCreateTransferValidator();
  const queryClient = useQueryClient();
  const params = useParams();
  const locale = params.locale as string;

  const onSubmit = async (data: CreateTransferFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      await transfersAPI.post(data);
      setSuccessMessage("ტრანსფერი წარმატებით შეიქმნა");
      await queryClient.invalidateQueries({ queryKey: ["transfers", locale] });
      form.reset();
      router.push(`?transfers=all`);
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
        <CardTitle>ახალი ტრანსფერის შექმნა</CardTitle>
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
              <FormField
                control={form.control}
                name="localizations.0.start_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>საწყისი ლოკაცია</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="შეიყვანეთ საწყისი ლოკაცია"
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
                name="localizations.0.end_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>საბოლოო ლოკაცია</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="შეიყვანეთ საბოლოო ლოკაცია"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Tabs defaultValue="sedan" className="w-full">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="sedan">Sedan</TabsTrigger>
                <TabsTrigger value="minivan">Minivan</TabsTrigger>
                <TabsTrigger value="vito">Vito</TabsTrigger>
                <TabsTrigger value="sprinter">Sprinter</TabsTrigger>
                <TabsTrigger value="bus">Bus</TabsTrigger>
              </TabsList>

              {["sedan", "minivan", "vito", "sprinter", "bus"].map(
                (vehicleType) => (
                  <TabsContent
                    key={vehicleType}
                    value={vehicleType}
                    className="mt-0"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`prices.${vehicleType}.season_price` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>სეზონური ფასი</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="სეზონური ფასი"
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
                        name={`prices.${vehicleType}.off_season_price` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>არასეზონური ფასი</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="არასეზონური ფასი"
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
                  </TabsContent>
                )
              )}
            </Tabs>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  იტვირთება...
                </>
              ) : (
                "ტრანსფერის შექმნა"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateTransfer;
