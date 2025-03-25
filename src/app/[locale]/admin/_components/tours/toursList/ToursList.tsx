import { useRouter } from "next/navigation";
import {
  Plus,
  Loader2,
  Pencil,
  MapPin,
  Clock,
  Trash,
  Users,
  User,
} from "lucide-react";
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

  const { data, isLoading, error } = useQuery({
    queryKey: ["tours"],
    queryFn: () => toursAPI.get("ka"),
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
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg p-6">
          <p className="text-gray-500 text-lg mb-4">ტურები არ მოიძებნა</p>
          <Button onClick={handleCreateTour} variant="outline">
            დაამატე პირველი ტური
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-100 rounded-lg font-medium text-sm text-gray-600">
            <div className="col-span-2">სურათი</div>
            <div className="col-span-4">ტურის დასახელება</div>
            <div className="col-span-3">საწყისი ლოკაცია</div>
            <div className="col-span-2">ხანგრძლივობა</div>
            <div className="col-span-1 text-right">მოქმედებები</div>
          </div>
          <div className="space-y-4">
            {tours.map((tour: Tour) => {
              const mainLocalization = tour.localizations[0] || {};

              return (
                <Card
                  key={tour.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-2 flex flex-col items-center">
                        <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-200">
                          {tour.image ? (
                            <Image
                              src={`https://api.daudtravel.com${tour.image}`}
                              alt={mainLocalization.name || "Tour image"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <MapPin className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          {tour.type ? (
                            <User className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Users className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-600">
                            {tour.type ? "ინდივიდუალური" : "ჯგუფური"}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-4">
                        <span className="font-medium text-sm">
                          {mainLocalization.name || "არ არის მითითებული"}
                        </span>
                      </div>
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {mainLocalization.start_location ||
                              "არ არის მითითებული"}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {tour.day || "0"} დღე / {tour.night || "0"} ღამე
                          </span>
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

                    {/* Mobile View */}
                    <div className="md:hidden flex flex-col space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-200">
                            {tour.image ? (
                              <Image
                                src={`https://api.daudtravel.com${tour.image}`}
                                alt={mainLocalization.name || "Tour image"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <MapPin className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 block">
                              {mainLocalization.name || "არ არის მითითებული"}
                            </span>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>
                                {mainLocalization.start_location ||
                                  "არ არის მითითებული"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
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
