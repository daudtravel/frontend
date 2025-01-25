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
import { useRouter } from "next/navigation";
import {
  TransferFormData,
  useCreateTransferValidator,
} from "./CreateTransferValidator";
import { transfersAPI } from "@/src/routes/transfers";

const CreateTransfer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const form = useCreateTransferValidator();

  const onSubmit = async (data: TransferFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      await transfersAPI.post(data);
      setSuccessMessage("ტრანსფერი წარმატებით შეიქმნა");
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
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>თარიღი</FormLabel>
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
                    <FormLabel>საერთო ფასი</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="ტრანსფერის საერთო ფასი"
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
                    <FormLabel>დაჯავშნის ფასი</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="დაჯავშნის ფასი"
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
