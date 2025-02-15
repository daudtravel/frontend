"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

const MONTHS = [
  "იანვარი",
  "თებერვალი",
  "მარტი",
  "აპრილი",
  "მაისი",
  "ივნისი",
  "ივლისი",
  "აგვისტო",
  "სექტემბერი",
  "ოქტომბერი",
  "ნოემბერი",
  "დეკემბერი",
];

export function EditTour({ params }: { params: { id: string } }) {
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

  const { data } = useQuery({
    queryKey: ["tour", params.id],
    queryFn: () => toursAPI.getByIdAllLocales(params.id),
    refetchOnMount: true,
    staleTime: 0,
  });

  const updateTourMutation = useMutation({
    //eslint-disable-next-line
    mutationFn: (updatedData: any) => toursAPI.put(params.id, updatedData),
    onSuccess: (response) => {
      if (response.message === "Tour updated successfully") {
        setSuccessMessage("Tour updated successfully");
        queryClient.invalidateQueries({ queryKey: ["tours"] });
        router.push("?tours=all");
      } else {
        setErrorMessage(response.message || "Failed to update tour");
      }
    },
    onError: (error) => {
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
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      //eslint-disable-next-line
      const formattedData: any = {
        ...data,
        type: tourType,
      };

      if (tourType) {
        const individualPrices = Object.fromEntries(
          Array.from({ length: 12 }, (_, i) => {
            const monthKey = (i + 1).toString();
            const monthData = data.individual_prices?.[monthKey];

            const perPersonPrices: Record<string, number> = {};
            const roomPrices: Record<string, number> = {};

            if (monthData?.per_person) {
              Object.entries(monthData.per_person).forEach(
                ([personKey, price]) => {
                  if (
                    price !== undefined &&
                    price !== null &&
                    price.toString().trim() !== ""
                  ) {
                    perPersonPrices[personKey] = Number(price);
                  }
                }
              );
            }

            if (monthData?.room_prices) {
              Object.entries(monthData.room_prices).forEach(
                ([roomKey, price]) => {
                  if (
                    price !== undefined &&
                    price !== null &&
                    price.toString().trim() !== ""
                  ) {
                    roomPrices[roomKey] = Number(price);
                  }
                }
              );
            }

            return [
              monthKey,
              {
                per_person: perPersonPrices,
                room_prices: roomPrices,
              },
            ];
          })
        );

        formattedData.individual_prices = individualPrices;
        formattedData.group_prices = {};
      } else {
        formattedData.group_prices = {
          total_price: data.group_prices?.total_price,
          reservation_price: data.group_prices?.reservation_price,
          discounted_price: data.group_prices?.discounted_price,
        };
        formattedData.individual_prices = {};
      }

      const submitData = {
        ...formattedData,
        date: data.date || new Date().toISOString().split("T")[0],
        duration: data.duration,
        localizations: data.localizations,
        public: data.public,
        ...(hasNewMainImage && { image: data.image }),
        ...(newGalleryImages.length > 0 && { gallery: newGalleryImages }),
        ...(deletedImages.length > 0 && { deleteImages: deletedImages }),
      };

      await updateTourMutation.mutate(submitData);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to update tour");
    } finally {
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

        // Ensure date is in YYYY-MM-DD format
        const formattedDate = tour.date
          ? tour.date.split("T")[0]
          : new Date().toISOString().split("T")[0];

        const formData: TourFormData = {
          type: tour.type,
          localizations: SUPPORTED_LOCALES.map((locale) => ({
            locale,
            start_location: tour.translations[locale]?.start_location || "",
            next_location: tour.translations[locale]?.next_location || [],
            description: tour.translations[locale]?.description || "",
          })),
          duration: tour.duration,
          group_prices: tour.group_prices || {
            total_price: undefined,
            reservation_price: undefined,
            discounted_price: undefined,
          },
          individual_prices:
            tour.individual_prices ||
            Object.fromEntries(
              Array.from({ length: 12 }, (_, i) => [
                (i + 1).toString(),
                { per_person: {}, room_prices: {} },
              ])
            ),
          image: tour.image,
          gallery: tour.gallery || [],
          public: tour.public,
          date: formattedDate,
        };

        form.reset(formData);
        setTourType(tour.type);
        setMainImagePreview(tour.image);
        setGalleryPreviews(tour.gallery || []);
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
            <h1>
              <span className="font-bold">ტურის ტიპი:</span>{" "}
              {tourType ? "ინდივიდუალური" : "ჯგუფური"}{" "}
            </h1>
            <FormField
              control={form.control}
              name="public"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <FormLabel className="text-base">ხილვადობა</FormLabel>
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
            <div className="w-full grid grid-cols-2 gap-2">
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
                        <FormLabel>საწყისი ლოკაცია</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
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
                                  placeholder={`Location ${locationIndex + 1}`}
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
                            placeholder="დაამატე აღწერა"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
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
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ხანგრძლივობა (დღე/ღამე)</FormLabel>
                    <FormControl>
                      <Input
                        type="string"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              {!tourType && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">ჯგუფური ფასები</h3>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name={`group_prices.total_price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>საერთო ფასი</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`group_prices.reservation_price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>დაჯავშნის ფასი</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`group_prices.discounted_price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ფასდაკლებული ფასი</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {tourType && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">ინდივიდუალური ფასები</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {MONTHS.map((month, monthIndex) => {
                      const monthNumber = (monthIndex + 1).toString();
                      return (
                        <div
                          key={monthNumber}
                          className="border rounded-lg p-4"
                        >
                          <h4 className="font-medium mb-3">{month}</h4>
                          <div className="space-y-4">
                            {/* Per Person Prices */}
                            <div>
                              <h5 className="text-sm font-medium mb-2">
                                პიროვნული ფასები
                              </h5>
                              <div className="grid grid-cols-2 gap-2">
                                {[1, 2, 3, 4, 5, 6].map((personNum) => (
                                  <FormField
                                    key={`person_${monthNumber}_${personNum}`}
                                    control={form.control}
                                    name={`individual_prices.${monthNumber}.per_person.${personNum}`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>
                                          {personNum} პიროვნება
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              form.setValue(
                                                `individual_prices.${monthNumber}.per_person.${personNum}`,
                                                value
                                                  ? Number(value)
                                                  : undefined,
                                                { shouldValidate: true }
                                              );
                                            }}
                                            value={field.value ?? ""}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Room Prices */}
                            <div>
                              <h5 className="text-sm font-medium mb-2">
                                ოთახის ფასები
                              </h5>
                              <div className="grid grid-cols-2 gap-2">
                                {[1, 2, 3, 4, 5].map((roomNum) => (
                                  <FormField
                                    key={`room_${monthNumber}_${roomNum}`}
                                    control={form.control}
                                    name={`individual_prices.${monthNumber}.room_prices.${roomNum}`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>{roomNum} ოთახი</FormLabel>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              form.setValue(
                                                `individual_prices.${monthNumber}.room_prices.${roomNum}`,
                                                value
                                                  ? Number(value)
                                                  : undefined,
                                                { shouldValidate: true }
                                              );
                                            }}
                                            value={field.value ?? ""}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

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
                      <div className="mt-2 w-64 h-40 relative">
                        <Image
                          src={
                            mainImagePreview.startsWith("data:")
                              ? mainImagePreview
                              : `https://api.daudtravel.com${mainImagePreview}`
                          }
                          alt="Main image preview"
                          fill
                          className="w-full h-full object-cover rounded"
                          quality={100}
                        />
                      </div>
                    )}
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
                      <div className="mt-2 grid grid-cols-5 gap-2 h-32">
                        {galleryPreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={
                                preview.startsWith("data:")
                                  ? preview
                                  : `https://api.daudtravel.com${preview}`
                              }
                              alt={`Gallery image ${index + 1}`}
                              layout="fill"
                              objectFit="cover"
                              className="rounded"
                              quality={100}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  განახლება...
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
