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
import { Textarea } from "@/src/components/ui/textarea";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import {
  useEditTourValidator,
  SUPPORTED_LOCALES,
  TourFormData,
} from "./editTourValidator";
import { handleFileToBase64 } from "@/src/utlis/base64/mainImageUpload";
import { handleMultipleFilesToBase64 } from "@/src/utlis/base64/galleryImageUpload";
import { Switch } from "@/src/components/ui/switch";
import { axiosInstance } from "@/src/utlis/axiosInstance";

export function EditTour({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const form = useEditTourValidator();

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/tours/${params.id}`);
        const tour = response.data.data.tour;
        const formData: TourFormData = {
          localizations: SUPPORTED_LOCALES.map((locale) => ({
            locale,
            name: tour.translations[locale]?.name || "",
            destination: tour.translations[locale]?.destination || "",
            description: tour.translations[locale]?.description || "",
          })),
          duration: tour.duration,
          total_price: tour.total_price,
          reservation_price: tour.reservation_price,
          image: tour.image,
          gallery: tour.gallery || [],
          public: tour.public,
        };
        form.reset(formData);
        setMainImagePreview(tour.image);
        setGalleryPreviews(tour.gallery || []);
      } catch (error) {
        console.log(error);
        setErrorMessage("Failed to load tour details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTourDetails();
  }, [form, params.id]);

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
    const imageToRemove = galleryPreviews[index];
    if (!imageToRemove.startsWith("data:image")) {
      setDeletedImages((prev) => [...prev, imageToRemove]);
    }

    const newGalleryPreviews = galleryPreviews.filter((_, i) => i !== index);
    setGalleryPreviews(newGalleryPreviews);
    form.setValue("gallery", newGalleryPreviews);
  };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const submitData = {
        duration: form.getValues("duration"),
        total_price: form.getValues("total_price"),
        reservation_price: form.getValues("reservation_price"),
        localizations: form.getValues("localizations"),
        public: form.getValues("public"),
        image: form.getValues("image")?.startsWith("data:image")
          ? form.getValues("image")
          : null,

        gallery: form
          .getValues("gallery")
          ?.filter((img: string) => img.startsWith("data:image")),
        deleteImages: deletedImages.length > 0 ? deletedImages : null,
      };

      await axiosInstance.put(`/tours/${params.id}`, submitData);

      setSuccessMessage("Tour updated successfully");
      router.push("?tours=all");
    } catch (error) {
      console.error("Error updating tour:", error);
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Failed to update tour"
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
                    name={`localizations.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`localizations.${index}.destination`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`localizations.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Days)</FormLabel>
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
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Main Image</FormLabel>
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
                              : `https://api.daudtravel.com${mainImagePreview}`
                          }
                          alt="Main image preview"
                          width={800}
                          height={600}
                          className="w-full h-auto max-h-48 object-cover rounded"
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
                    <FormLabel>Gallery Images</FormLabel>
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
                      <div className="mt-2 grid grid-cols-3 gap-2 h-32">
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
                  Updating...
                </>
              ) : (
                "Update Tour"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default EditTour;
