import { useRouter } from "next/navigation";
import { Plus, Loader2, Pencil, MapPin, Clock, Trash } from "lucide-react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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

const api = {
  fetchTours: async (): Promise<ApiResponse> => {
    const response = await axios.get<ApiResponse>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/tours`
    );
    return response.data;
  },
};

export function ToursList() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["tours"],
    queryFn: api.fetchTours,
  });

  const handleEditTour = (tourId: string) => {
    router.push(`?tours=${tourId}`);
  };

  const handleCreateTour = () => {
    router.push("?tours=createTour");
  };

  const handleDeleteTour = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/tours/${id}`);
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
    <div className="container mx-auto px-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">ტურები</h1>
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
          <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-100 rounded-lg font-medium text-sm text-gray-600">
            <div className="col-span-1">სურათი</div>
            <div className="col-span-3">ტურის დასახელება</div>
            <div className="col-span-3">დანიშნულების ადგილი</div>
            <div className="col-span-2">ხანგრძლივობა</div>
            <div className="col-span-2">ფასი</div>
          </div>

          <div className="space-y-4">
            {tours.map((tour) => (
              <Card
                key={tour.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden">
                        {tour.image ? (
                          <Image
                            src={`http://localhost:3001${tour.image}`}
                            alt={tour.localizations[0]?.name || "Tour image"}
                            fill
                            className="object-cover rounded-full"
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
                      <span className="font-semibold">
                        {tour.localizations[0]?.name || "Unnamed Tour"}
                      </span>
                    </div>

                    <div className="col-span-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm truncate">
                        {tour.localizations[0]?.destination ||
                          "არ არის მითითებული"}
                      </span>
                    </div>

                    <div className="col-span-2 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm">
                        {tour.duration
                          ? `${tour.duration} დღე`
                          : "არ არის მითითებული"}
                      </span>
                    </div>

                    <div className="col-span-2 font-medium">
                      {tour.total_price ? (
                        `${tour.total_price}₾`
                      ) : (
                        <span className="text-gray-500">
                          არ არის მითითებული
                        </span>
                      )}
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-black"
                          >
                            <Trash className="h-4 w-4 text-red-700" />
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

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTour(tour.id)}
                        className="text-gray-600 hover:text-black"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ToursList;
