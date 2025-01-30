import { useParams, useRouter } from "next/navigation";
import { Plus, Loader2, Pencil, MapPin, Clock, Trash } from "lucide-react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { Tour } from "@/src/types/tours";
import { toursAPI } from "@/src/routes/tours";

export function ToursList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams();
  const locale = params.locale as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["tours", locale],
    queryFn: () => toursAPI.get(locale || "ka"),
  });

  const handleEditTour = (tourId: string) => {
    router.push(`?tours=${tourId}`);
  };

  const handleCreateTour = () => {
    router.push("?tours=createTour");
  };

  const handleDeleteTour = async (id: string) => {
    try {
      await toursAPI.delete(id);
      queryClient.invalidateQueries({ queryKey: ["tours"] });
    } catch (error) {
      console.error("Failed to delete tour:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const tours = data?.data?.tours || [];


  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ტურები</h1>
        <Button onClick={handleCreateTour} className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          <span>ტურის დამატება</span>
        </Button>
      </div>

      {tours.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg mb-4">ტურები არ მოიძებნა</p>
          <Button onClick={handleCreateTour} variant="outline">
            დაამატე პირველი ტური
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-100 rounded-lg font-medium text-sm text-gray-600">
            <div className="col-span-1">სურათი</div>
            <div className="col-span-3">საწყისი ლოკაცია</div>
            <div className="col-span-3">შემდეგი ლოკაციები</div>
            <div className="col-span-2">დრო</div>
            <div className="col-span-2">ფასი</div>
            <div className="col-span-1 text-right">მოქმედებები</div>
          </div>

          <div className="space-y-4">
            {tours.map((tour: Tour) => {
              const mainLocalization = tour.localizations[0] || {};

              return (
                <Card
                  key={tour.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1">
                        <div className="relative h-14 w-14 rounded-lg overflow-hidden">
                          {tour.image ? (
                            <Image
                              src={`https://api.daudtravel.com${tour.image}`}
                              alt={
                                mainLocalization.start_location || "Tour image"
                              }
                              fill
                              className="object-cover"
                              priority={false}
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                              <MapPin className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="font-medium">
                            {mainLocalization.start_location ||
                              "არ არის მითითებული"}
                          </span>
                        </div>
                      </div>

                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            {mainLocalization.next_location?.join(", ") ||
                              "არ არის მითითებული"}
                          </span>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            {tour.duration || "არ არის მითითებული"}
                          </span>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="space-y-1">
                          <div className="font-medium">
                            {tour.total_price ? (
                              `${tour.total_price}₾`
                            ) : (
                              <span className="text-gray-500">
                                არ არის მითითებული
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            სარეზერვო: {tour.reservation_price}₾
                          </div>
                        </div>
                      </div>

                      <div className="col-span-1 flex justify-end gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTour(tour.id)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-red-600"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>ტურის წაშლა</AlertDialogTitle>
                              <AlertDialogDescription>
                                დარწმუნებული ხართ რომ გსურთ ტურის წაშლა?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>გაუქმება</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTour(tour.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                წაშლა
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ToursList;
