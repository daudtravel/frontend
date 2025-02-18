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
  FormDescription,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Loader2, Plus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { handleFileToBase64 } from "@/src/utlis/base64/mainImageUpload";
import { handleMultipleFilesToBase64 } from "@/src/utlis/base64/galleryImageUpload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import RichTextEditor from "@/src/components/textEditor/TextEditor";
import { TourFormData, useCreateTourValidator } from "./CreateTourValidator";
import { toursAPI } from "@/src/routes/tours";
import { Switch } from "@/src/components/ui/switch";



const CreateTour = () => {
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [tourType, setTourType] = useState(false);

  const router = useRouter();
  const form = useCreateTourValidator();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newTour: TourFormData) => toursAPI.post(newTour),
    onSuccess: async () => {
      setSuccessMessage("ტური წარმატებით შეიქმნა");
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      form.reset();
      setMainImagePreview(null);
      setGalleryPreviews([]);
      router.push(`?tours=all`);
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || "An error occurred");
      } else {
        setErrorMessage("მოულოდნელი შეცდომა. გთხოვთ სცადოთ თავიდან");
      }
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: TourFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const formattedData = {
      ...data,
      type: tourType,
    };

    if (!tourType) {
      const groupPrices: {
        total_price?: number;
        reservation_price?: number;
        discounted_price?: number;
      } = {};

      // Validate and add valid group prices to the object
      if (data.group_prices) {
        if (
          data.group_prices.total_price !== undefined &&
          data.group_prices.total_price !== null
        ) {
          groupPrices.total_price = Number(data.group_prices.total_price);
        }
        if (
          data.group_prices.reservation_price !== undefined &&
          data.group_prices.reservation_price !== null
        ) {
          groupPrices.reservation_price = Number(
            data.group_prices.reservation_price
          );
        }
        if (
          data.group_prices.discounted_price !== undefined &&
          data.group_prices.discounted_price !== null
        ) {
          groupPrices.discounted_price = Number(
            data.group_prices.discounted_price
          );
        }
      }

      // Only include group_prices if it has valid values
      if (Object.keys(groupPrices).length > 0) {
        formattedData.group_prices = groupPrices;
      }
    } else {
      // If tourType is true, remove group_prices
      delete formattedData.group_prices;
    }

    // Handle date assignment based on tourType
    if (!tourType) {
      if (!formattedData.date) {
        formattedData.date = new Date().toISOString().split("T")[0];
      }
    } else {
      formattedData.date = new Date().toISOString().split("T")[0];
    }

    mutation.mutate(formattedData);
  };

  const handleMainImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleFileToBase64(event, (base64Image) => {
      form.setValue("image", base64Image);
      setMainImagePreview(base64Image);
    });
  };

  const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleMultipleFilesToBase64(event, (base64Images) => {
      setGalleryPreviews((prev) => [...prev, ...base64Images]);
      const currentGallery = form.getValues("gallery") || [];
      form.setValue("gallery", [...currentGallery, ...base64Images]);
    });
  };

  const removeGalleryImage = (index: number) => {
    const newGalleryPreviews = galleryPreviews.filter((_, i) => i !== index);
    setGalleryPreviews(newGalleryPreviews);
    form.setValue("gallery", newGalleryPreviews);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>ახალი ტური შექმნა</CardTitle>
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
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">ტურის ტიპი</FormLabel>
                      <FormDescription>
                        აირჩიეთ ტურის ტიპი (ჯგუფური/ინდივიდუალური)
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={tourType}
                        onCheckedChange={(checked) => {
                          setTourType(checked);
                          field.onChange(checked);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
                  name="localizations.0.next_location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>შემდეგი ლოკაციები</FormLabel>
                      <div className="space-y-2">
                        {(field.value || []).map((location, locationIndex) => (
                          <div key={locationIndex} className="flex gap-2">
                            <Input
                              value={location}
                              onChange={(e) => {
                                const newLocations = [...(field.value || [])];
                                newLocations[locationIndex] = e.target.value;
                                field.onChange(newLocations);
                              }}
                              disabled={isSubmitting}
                              placeholder={`ლოკაცია ${locationIndex + 1}`}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => {
                                const newLocations = (field.value || []).filter(
                                  (_, i) => i !== locationIndex
                                );
                                field.onChange(newLocations);
                              }}
                              disabled={isSubmitting}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            field.onChange([...(field.value || []), ""]);
                          }}
                          disabled={isSubmitting}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          ლოკაციის დამატება
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="localizations.0.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>აღწერა</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                        placeholder="შეიყვანეთ ტურის აღწერა"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>დღე</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="მაგ: 3 დღე"
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
                name="night"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ღამე</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="მაგ: 3 დღე"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!tourType && (
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
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {tourType ? "ინდივიდუალური ფასები" : "ჯგუფური ფასები"}
              </h3>

              {tourType ? (
                <div className="p-4 border rounded-lg bg-gray-50">
                  <span className="text-gray-600">
                    ინდივიდუალური ფასები არ არის ხელმისაწვდომი
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="group_prices.total_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>საერთო ფასი</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              )
                            }
                            value={field.value ?? ""}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="group_prices.reservation_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>დაჯავშნის ფასი</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              )
                            }
                            value={field.value ?? ""}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="group_prices.discounted_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ფასდაკლებული ფასი</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              )
                            }
                            value={field.value ?? ""}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>მთავარი სურათი</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  {mainImagePreview && (
                    <div className="mt-2">
                      <Image
                        width={400}
                        height={400}
                        src={mainImagePreview}
                        alt="მთავარი სურათის გადახედვა"
                        className="max-w-full h-auto max-h-48 object-cover rounded"
                      />
                    </div>
                  )}
                  <FormDescription>
                    ატვირთეთ ტურის მთავარი სურათი (PNG, JPEG, GIF, WebP)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gallery"
              render={() => (
                <FormItem>
                  <FormLabel>გალერეა (არასავალდებულო)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  {galleryPreviews.length > 0 && (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {galleryPreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <Image
                            width={200}
                            height={200}
                            src={preview}
                            alt={`გალერეის სურათი ${index + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <FormDescription>
                    ატვირთეთ დამატებითი სურათები გალერეისთვის
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit button */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  იტვირთება...
                </>
              ) : (
                "ტურის შექმნა"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateTour;
