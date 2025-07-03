"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Loader2, Plus, X } from "lucide-react";
import Image from "next/image";
import {
  useEditTourValidator,
  SUPPORTED_LOCALES,
  TourFormData,
} from "./editTourValidator";
import { handleFileToBase64 } from "@/src/utlis/base64/mainImageUpload";
import { handleMultipleFilesToBase64 } from "@/src/utlis/base64/galleryImageUpload";
import { Switch } from "@/src/components/ui/switch";
import RichTextEditor from "@/src/components/textEditor/TextEditor";
import { toursAPI } from "@/src/routes/tours";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function EditTour({ params }: { params: { id: string } }) {
  const [isDailyTour, setIsDailyTour] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [newGalleryImages, setNewGalleryImages] = useState<string[]>([]);
  const [hasNewMainImage, setHasNewMainImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [tourType, setTourType] = useState<boolean | null>(null);
  const router = useRouter();
  const form = useEditTourValidator();
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ["tour", params.id],
    queryFn: () => toursAPI.getByIdAllLocales(params.id),
    refetchOnMount: true,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    refetch();
  }, [params.id, refetch]);

  const updateTourMutation = useMutation({
    mutationFn: (updatedData: TourFormData) =>
      toursAPI.put(params.id, updatedData),
    onSuccess: (response) => {
      setIsSubmitting(false);
      if (response.message === "Tour updated successfully") {
        setSuccessMessage("Tour updated successfully");

        queryClient.invalidateQueries({ queryKey: ["tours"] });
        queryClient.invalidateQueries({ queryKey: ["tour", params.id] });

        refetch();

        router.push("?tours=all");
      } else {
        setErrorMessage(response.message || "Failed to update tour");
      }
    },
    onError: (error) => {
      setIsSubmitting(false);
      console.error("Error updating tour:", error);
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Failed to update tour"
        );
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    },
  });

  const onSubmit = async (data: TourFormData) => {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedData: any = {
        ...data,
        type: tourType,
        daily: isDailyTour,
      };
      if (deletedImages.length > 0) {
        formattedData.deleteImages = deletedImages;
      }

      if (newGalleryImages.length > 0) {
        formattedData.gallery = newGalleryImages;
      } else {
        delete formattedData.gallery;
      }

      if (!hasNewMainImage) {
        delete formattedData.image;
      }

      if (!tourType) {
        // Group tour logic
        const groupPrices: {
          total_price?: number;
          reservation_price?: number;
          discounted_price?: number;
        } = {};

        if (data.group_prices) {
          if (data.group_prices.total_price != null) {
            groupPrices.total_price = Number(data.group_prices.total_price);
          }
          if (data.group_prices.reservation_price != null) {
            groupPrices.reservation_price = Number(
              data.group_prices.reservation_price
            );
          }
          if (data.group_prices.discounted_price != null) {
            groupPrices.discounted_price = Number(
              data.group_prices.discounted_price
            );
          }
        }

        formattedData.group_prices =
          Object.keys(groupPrices).length > 0 ? groupPrices : {};
        formattedData.individual_prices = null;
        delete formattedData.amount_persons;

        if (!formattedData.date) {
          formattedData.date = new Date().toISOString().split("T")[0];
        }
      } else {
        // Individual tour logic
        const individualPrices = {
          season: {
            total_price: 0,
            discounted_price: 0,
            reservation_price: 0,
          },
          off_season: {
            total_price: 0,
            discounted_price: 0,
            reservation_price: 0,
          },
        };

        if (data.individual_prices) {
          if (data.individual_prices.season) {
            const { total_price, discounted_price, reservation_price } =
              data.individual_prices.season;
            if (total_price != null)
              individualPrices.season.total_price = Number(total_price);
            if (discounted_price != null)
              individualPrices.season.discounted_price =
                Number(discounted_price);
            if (reservation_price != null)
              individualPrices.season.reservation_price =
                Number(reservation_price);
          }
          if (data.individual_prices.off_season) {
            const { total_price, discounted_price, reservation_price } =
              data.individual_prices.off_season;
            if (total_price != null)
              individualPrices.off_season.total_price = Number(total_price);
            if (discounted_price != null)
              individualPrices.off_season.discounted_price =
                Number(discounted_price);
            if (reservation_price != null)
              individualPrices.off_season.reservation_price =
                Number(reservation_price);
          }
        }

        formattedData.individual_prices = individualPrices;
        if (data.amount_persons != null) {
          formattedData.amount_persons = Number(data.amount_persons);
        }
        formattedData.group_prices = null;
        delete formattedData.date;
      }

      updateTourMutation.mutate(formattedData);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to update tour");
      setIsSubmitting(false);
    }
  };

  const handleMainImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleFileToBase64(event, (base64Image) => {
      form.setValue("image", base64Image);
      setMainImagePreview(base64Image);
      setHasNewMainImage(true);
    });
  };

  const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleMultipleFilesToBase64(event, (base64Images) => {
      const newImages = base64Images.filter((img) =>
        img.startsWith("data:image")
      );
      setNewGalleryImages((prev) => [...prev, ...newImages]);
      setGalleryPreviews((prev) => [...prev, ...newImages]);
      const currentGallery = form.getValues("gallery") || [];
      form.setValue("gallery", [...currentGallery, ...newImages]);
    });
  };

  const removeGalleryImage = (index: number) => {
    const imageToRemove = galleryPreviews[index];

    if (!imageToRemove.startsWith("data:image")) {
      setDeletedImages((prev) => [...prev, imageToRemove]);
    } else {
      setNewGalleryImages((prev) =>
        prev.filter((img) => img !== imageToRemove)
      );
    }

    const newGalleryPreviews = galleryPreviews.filter((_, i) => i !== index);
    setGalleryPreviews(newGalleryPreviews);
    form.setValue("gallery", newGalleryPreviews);
  };

  useEffect(() => {
    const fetchTourDetails = async () => {
      if (!data) return;

      try {
        setIsLoading(true);
        const tour = data.data.tour;
        const formattedDate = tour.date
          ? tour.date.split("T")[0]
          : new Date().toISOString().split("T")[0];
        const formData: TourFormData = {
          type: tour.type,
          daily: tour.daily,

          localizations: SUPPORTED_LOCALES.map((locale) => {
            const localization =
              tour.localizations.find(
                (l: { locale: string }) => l.locale === locale
              ) || {};
            return {
              locale,
              name: localization.name || "",
              start_location: localization.start_location || "",
              next_location: localization.next_location || [],
              description: localization.description || "",
            };
          }),
          day: tour.day,
          night: tour.night,
          group_prices: tour.group_prices || {
            total_price: undefined,
            reservation_price: undefined,
            discounted_price: undefined,
          },
          individual_prices: tour.individual_prices || {
            season: {
              total_price: 0,
              discounted_price: 0,
              reservation_price: 0,
            },
            off_season: {
              total_price: 0,
              discounted_price: 0,
              reservation_price: 0,
            },
          },
          amount_persons: tour.amount_persons || 1,
          image: tour.image,
          gallery: tour.gallery || [],
          public: tour.public,
          date: formattedDate,
        };

        form.reset(formData);
        setTourType(tour.type);
        setMainImagePreview(tour.image);
        setGalleryPreviews(tour.gallery || []);
        setIsDailyTour(tour.daily || false);
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to load tour details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourDetails();
  }, [data, form, params.id]);

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
        <CardTitle>რედაქტირება</CardTitle>
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
              name="type"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm md:text-base">
                      ტურის ტიპი
                    </FormLabel>
                    <FormDescription>
                      {tourType ? "ინდივიდუალური" : "ჯგუფური"} ტური
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={!!tourType}
                      onCheckedChange={(checked) => {
                        setTourType(checked);
                        field.onChange(checked);
                      }}
                      aria-label="Toggle tour type"
                      disabled={true}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="public"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <FormLabel className="text-sm md:text-base">
                    ხილვადობა
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                      aria-label="Toggle tour visibility"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-sm md:text-base">
                  ყოველდღიური ტური
                </FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={isDailyTour}
                  onCheckedChange={(checked) => {
                    setIsDailyTour(checked);
                  }}
                  aria-label="Toggle daily tour"
                  disabled={isSubmitting}
                />
              </FormControl>
            </FormItem>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUPPORTED_LOCALES.map((locale, index) => (
                <div key={locale} className="space-y-4 p-4 border rounded-lg">
                  <h3 className="text-base md:text-lg font-semibold capitalize">
                    {locale} თარგმანი
                  </h3>
                  <FormField
                    control={form.control}
                    name={`localizations.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ტურის დასახელება</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="შეიყვანეთ ტურის დასახელება"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`localizations.${index}.start_location`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>საწყისი ლოკაცია</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="შეიყვანეთ საწყისი ლოკაცია"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`localizations.${index}.next_location`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>შემდეგი ლოკაციები</FormLabel>
                        <div className="space-y-2">
                          {(Array.isArray(field.value) ? field.value : []).map(
                            (location, locationIndex) => (
                              <div key={locationIndex} className="flex gap-2">
                                <Input
                                  value={location}
                                  onChange={(e) => {
                                    const newLocations = [
                                      ...(Array.isArray(field.value)
                                        ? field.value
                                        : []),
                                    ];
                                    newLocations[locationIndex] =
                                      e.target.value;
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
                                    const newLocations = (
                                      Array.isArray(field.value)
                                        ? field.value
                                        : []
                                    ).filter((_, i) => i !== locationIndex);
                                    field.onChange(newLocations);
                                  }}
                                  disabled={isSubmitting}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const currentLocations = Array.isArray(
                                field.value
                              )
                                ? field.value
                                : [];
                              field.onChange([...currentLocations, ""]);
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

                  <FormField
                    control={form.control}
                    name={`localizations.${index}.description`}
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
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                        onChange={(e) => field.onChange(e.target.value)}
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
                        placeholder="მაგ: 2 ღამე"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
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
            {tourType ? (
              <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                <h3 className="text-base md:text-lg font-medium">
                  ინდივიდუალური ტურის დეტალები
                </h3>
                <FormField
                  control={form.control}
                  name="amount_persons"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ადამიანების რაოდენობა</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="მაქსიმალური ადამიანების რაოდენობა"
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
                      <FormDescription>
                        შეიყვანეთ მაქსიმალური ადამიანების რაოდენობა ტურისთვის
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <h4 className="font-medium">სეზონური ფასები</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="individual_prices.season.total_price"
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
                      name="individual_prices.season.discounted_price"
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
                    <FormField
                      control={form.control}
                      name="individual_prices.season.reservation_price"
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
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">არასეზონური ფასები</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="individual_prices.off_season.total_price"
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
                      name="individual_prices.off_season.discounted_price"
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
                    <FormField
                      control={form.control}
                      name="individual_prices.off_season.reservation_price"
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
                  </div>
                </div>
              </div>
            ) : (
              /* Group Prices */
              <div className="space-y-4">
                <h3 className="text-base md:text-lg font-medium">
                  ჯგუფური ფასები
                </h3>
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
                    name="group_prices.reservation_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>დაჯავშნის ფასი</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
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
                    name="group_prices.discounted_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ფასდაკლებული ფასი</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
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
            )}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>მთავარი ფოტო</FormLabel>
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
                          src={
                            mainImagePreview.startsWith("data:")
                              ? mainImagePreview
                              : `${process.env.NEXT_PUBLIC_BASE_URL}${mainImagePreview}`
                          }
                          alt="მთავარი სურათის გადახედვა"
                          width={400}
                          height={225}
                          className="object-cover rounded max-h-48"
                        />
                      </div>
                    )}
                    <FormDescription>
                      განაახლეთ ტურის მთავარი სურათი (PNG, JPEG, GIF, WebP)
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
                    <FormLabel>გალერია</FormLabel>
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
                      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                        {galleryPreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={
                                preview.startsWith("data:")
                                  ? preview
                                  : `${process.env.NEXT_PUBLIC_BASE_URL}${preview}`
                              }
                              alt={`გალერეის სურათი ${index + 1}`}
                              width={200}
                              height={150}
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
                      განაახლეთ გალერიის სურათები
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              onClick={(e) => {
                if (isSubmitting) {
                  e.preventDefault();
                }
              }}
            >
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

export default EditTour;
