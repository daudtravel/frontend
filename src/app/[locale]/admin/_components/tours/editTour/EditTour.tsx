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
import { axiosInstance } from "@/src/utlis/axiosInstance";
import RichTextEditor from "@/src/components/textEditor/TextEditor";

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
            start_location: tour.translations[locale]?.start_location || "",
            next_location: tour.translations[locale]?.next_location || [],
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
        console.error(error);
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
      // Update form value to include both existing and new images
      const currentGallery = form.getValues("gallery") || [];
      form.setValue("gallery", [...currentGallery, ...newImages]);
    });
  };

  const removeGalleryImage = (index: number) => {
    const imageToRemove = galleryPreviews[index];

    // If removing an existing image (not a new upload)
    if (!imageToRemove.startsWith("data:image")) {
      setDeletedImages((prev) => [...prev, imageToRemove]);
    } else {
      // If removing a newly uploaded image
      setNewGalleryImages((prev) =>
        prev.filter((img) => img !== imageToRemove)
      );
    }

    // Update preview and form
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    form.setValue(
      "gallery",
      galleryPreviews.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      // Prepare the submit data
      const formValues = form.getValues();
      const submitData = {
        duration: formValues.duration,
        total_price: formValues.total_price,
        reservation_price: formValues.reservation_price,
        localizations: formValues.localizations,
        public: formValues.public,
        // Only include image if it has changed
        image: hasNewMainImage ? formValues.image : null,
        // Only include gallery changes if there are any
        ...(newGalleryImages.length > 0 && { gallery: newGalleryImages }),
        // Only include deleteImages if there are images to delete
        ...(deletedImages.length > 0 && { deleteImages: deletedImages }),
      };
      // If there are no gallery changes and deleteImages is empty, ensure gallery is an empty array
      if (newGalleryImages.length === 0 && deletedImages.length === 0) {
        submitData.gallery = [];
      }

      const response = await axiosInstance.put(
        `/tours/${params.id}`,
        submitData
      );

      if (response.data.message === "Tour updated successfully") {
        setSuccessMessage("Tour updated successfully");
        router.push("?tours=all");
      } else {
        throw new Error(response.data.message || "Failed to update tour");
      }
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
                    name={`localizations.${index}.next_location`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Next Locations</FormLabel>
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
                            Add Location
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isSubmitting}
                            placeholder="Enter description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            {/* Tour Details */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Days)</FormLabel>
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

            {/* Images */}
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
                          width={800} // Increased from 400
                          height={600} // Increased from 300
                          className="w-full h-auto max-h-48 object-cover rounded"
                          quality={100} // Added quality prop
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
