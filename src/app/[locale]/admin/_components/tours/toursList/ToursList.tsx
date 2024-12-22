import React from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

interface TourLocalization {
  locale: string;
  name: string;
  destination: string;
  description: string;
}

interface Tour {
  id: string;
  localizations: TourLocalization[];
  duration?: number;
  total_price?: number;
  reservation_price?: number;
  image?: string;
  gallery?: string[];
}

interface ApiResponse {
  data: {
    tours: Tour[];
  };
  error?: string;
}

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
  const locale = "ka";

  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["tours"],
    queryFn: api.fetchTours,
  });

  console.log(data);

  const handleTourClick = (tourId: string) => {
    router.push(`?tours=${tourId}`);
  };

  const handleCreateTour = () => {
    router.push("?tours=createTour");
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ტურები</h1>
        <Button
          onClick={handleCreateTour}
          className="flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>ტურის დამატება</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((item) => (
          <Card
            key={item.id}
            onClick={() => handleTourClick(item.id)}
            className="cursor-pointer hover:shadow-lg transition-all duration-300 group relative"
          >
            <div className="relative h-48 w-full">
              {item.image ? (
                <Image
                  fill
                  src={item.image}
                  alt={item.localizations[0]?.name || "Tour Image"}
                  className="object-cover rounded-t-lg"
                  priority={false}
                />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2 line-clamp-1">
                {item.localizations[0]?.name || "Unnamed Tour"}
              </h2>
              <p className="text-gray-600 mb-2 line-clamp-1">
                {item.localizations[0]?.destination || "Not specified"}
              </p>
              {item.duration && (
                <p className="text-gray-600">
                  ხანგრზლივობა: {item.duration} საათი
                </p>
              )}
              {item.total_price && (
                <p className="text-green-600 font-bold mt-2">
                  ფასი: ₾{item.total_price}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {tours.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500">ტურები არ მოიძებნა</p>
        </div>
      )}
    </div>
  );
}
