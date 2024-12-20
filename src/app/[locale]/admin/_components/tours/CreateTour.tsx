import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Textarea } from "@/src/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const TourSchema = z.object({
  translations: z.object({
    ka: z.object({
      name: z.string().min(1, "Tour name is required"),
      destination: z.string().min(1, "Destination is required"),
      description: z.string().min(1, "Description is required"),
    }),
  }),
  duration: z.number().min(0, "Duration must be a positive number"),
  total_price: z.number().min(0, "Total price must be a positive number"),
  reservation_price: z
    .number()
    .min(0, "Reservation price must be a positive number"),
  image_url: z.string().url("Invalid image URL").optional(),
});

type TourFormData = z.infer<typeof TourSchema>;

const CreateTour = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<TourFormData>({
    resolver: zodResolver(TourSchema),
    defaultValues: {
      translations: {
        ka: {
          name: "",
          destination: "",
          description: "",
        },
      },
      duration: undefined,
      total_price: undefined,
      reservation_price: undefined,
      image_url: undefined,
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        form.setValue("image_url", base64Image);
        setImagePreview(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: TourFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/create-tour`, data);

      // Success message
      setSuccessMessage("ტური წარმატებით შეიქმნა");

      // Reset form and clear image preview
      form.reset();
      setImagePreview(null);

      // Redirect to tours list
      router.push(`?tours=all`);
    } catch (error) {
      // Error handling
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>ახალი ტური შექმნა</CardTitle>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {successMessage}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="translations.ka.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ტურის სახელი</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="შეიყვანეთ ტურის სახელი"
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
                name="translations.ka.destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>დანიშნულების ადგილი</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="შეიყვანეთ დანიშნულების ადგილი"
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
              name="translations.ka.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>აღწერა</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="შეიყვანეთ ტურის აღწერა"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ხანგრძლივობა (საათი)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="ტურის ხანგრძლივობა"
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
                    <FormLabel>საერთო ფასი</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="ტურის საერთო ფასი"
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

            <FormItem>
              <FormLabel>ტურის სურათი (არასავალდებულო)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isSubmitting}
                />
              </FormControl>
              {imagePreview && (
                <div className="mt-2">
                  <Image
                    width={400}
                    height={400}
                    src={imagePreview}
                    alt="გადახედვა"
                    className="max-w-full h-auto max-h-48 object-cover rounded"
                  />
                </div>
              )}
              <FormDescription>
                ატვირთეთ ტურის სურათი (PNG, JPEG, GIF, WebP)
              </FormDescription>
            </FormItem>

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
