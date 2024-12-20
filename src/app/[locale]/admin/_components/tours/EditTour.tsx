"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";

// Zod schema for frontend validation
const TourFormSchema = z.object({
  translations: z.object({
    en: z.object({
      name: z.string().min(2, "Name (EN) is required"),
      destination: z.string().min(2, "Destination (EN) is required"),
      description: z.string().optional(),
    }),
    ka: z.object({
      name: z.string().min(2, "Name (KA) is required"),
      destination: z.string().min(2, "Destination (KA) is required"),
      description: z.string().optional(),
    }),
    ru: z.object({
      name: z.string().min(2, "Name (RU) is required"),
      destination: z.string().min(2, "Destination (RU) is required"),
      description: z.string().optional(),
    }),
  }),
  duration: z.number().positive("Duration must be a positive number"),
  total_price: z.number().positive("Total price must be a positive number"),
  reservation_price: z
    .number()
    .positive("Reservation price must be a positive number"),
  image_url: z.string().url("Invalid image URL").optional(),
});

type TourFormData = z.infer<typeof TourFormSchema>;

export function EditTour({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<TourFormData>({
    resolver: zodResolver(TourFormSchema),
    defaultValues: {
      translations: {
        en: { name: "", destination: "", description: "" },
        ka: { name: "", destination: "", description: "" },
        ru: { name: "", destination: "", description: "" },
      },
      duration: 0,
      total_price: 0,
      reservation_price: 0,
    },
  });

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/tours/${params.id}`
        );

        const fetchedTour = response.data.tour;

        // Prepare form data with all translations
        const formData: TourFormData = {
          translations: {
            en: {
              name: fetchedTour.translations.en.name || "",
              destination: fetchedTour.translations.en.destination || "",
              description: fetchedTour.translations.en.description || "",
            },
            ka: {
              name: fetchedTour.translations.ka.name || "",
              destination: fetchedTour.translations.ka.destination || "",
              description: fetchedTour.translations.ka.description || "",
            },
            ru: {
              name: fetchedTour.translations.ru.name || "",
              destination: fetchedTour.translations.ru.destination || "",
              description: fetchedTour.translations.ru.description || "",
            },
          },
          duration: fetchedTour.duration,
          total_price: fetchedTour.total_price,
          reservation_price: fetchedTour.reservation_price,
          image_url: fetchedTour.image_url,
        };

        // Reset form with fetched data
        form.reset(formData);
        setPreviewImage(fetchedTour.image_url);
      } catch (error) {
        console.error("Error fetching tour details:", error);
        setErrorMessage("Failed to load tour details");
        router.push("?tours=all");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourDetails();
  }, [params.id, router, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        form.setValue("image_url", base64);
        setPreviewImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: TourFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/tours/${params.id}`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      router.push("?tours=all");
    } catch (error) {
      console.error("Error Updating Tour", error);
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Failed to update tour"
        );
      } else {
        setErrorMessage("An unexpected error occurred");
      }
      setIsSubmitting(false);
    }
  };

  const handleBackToList = () => {
    router.push("?tours=all");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Tour Details</h1>
        <button
          onClick={handleBackToList}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back to List
        </button>
      </div>

      {errorMessage && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Language Sections */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {(["en", "ka", "ru"] as const).map((lang) => (
            <div key={lang} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 capitalize">
                {lang} Translation
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Name</label>
                  <input
                    type="text"
                    {...form.register(`translations.${lang}.name`)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  {form.formState.errors.translations?.[lang]?.name && (
                    <p className="text-red-500 mt-1">
                      {form.formState.errors.translations[lang].name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2">Destination</label>
                  <input
                    type="text"
                    {...form.register(`translations.${lang}.destination`)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  {form.formState.errors.translations?.[lang]?.destination && (
                    <p className="text-red-500 mt-1">
                      {
                        form.formState.errors.translations[lang].destination
                          .message
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2">Description</label>
                  <textarea
                    {...form.register(`translations.${lang}.description`)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tour Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">Duration (Hours)</label>
            <input
              type="number"
              {...form.register("duration", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.duration && (
              <p className="text-red-500 mt-1">
                {form.formState.errors.duration.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2">Total Price</label>
            <input
              type="number"
              {...form.register("total_price", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.total_price && (
              <p className="text-red-500 mt-1">
                {form.formState.errors.total_price.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2">Reservation Price</label>
            <input
              type="number"
              {...form.register("reservation_price", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.reservation_price && (
              <p className="text-red-500 mt-1">
                {form.formState.errors.reservation_price.message}
              </p>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <label className="block mb-2">Tour Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {previewImage && (
            <Image
              src={previewImage}
              width={600}
              height={500}
              alt="Preview"
              className="max-h-48 object-cover rounded-lg mt-4"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? "Updating Tour..." : "Update Tour"}
        </button>
      </form>
    </div>
  );
}

export default EditTour;
