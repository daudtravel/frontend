import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import axios from "axios";
import Image from "next/image";

type Tour = {
  id: string;
  translations: Record<
    string,
    { name: string; destination: string; description: string }
  >;
  duration?: number;
  total_price?: number;
  image_url?: string;
  language?: string;
  is_public: boolean;
};

export function ToursList() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = "ka";
  const router = useRouter();

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tours`);

      if (!response.ok) {
        throw new Error("Failed to fetch tours");
      }

      const data = await response.json();
      setTours(data.tours);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tours:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch tours");
      setLoading(false);
    }
  };

  const handleTourClick = (tourId: string) => {
    router.push(`?tours=${tourId}`);
  };

  const handleCreateTour = () => {
    router.push("?tours=createTour");
  };

  const handleDeleteTour = async (tourId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/tours/${tourId}`);
      fetchTours();
    } catch (err) {
      console.error("Error deleting tour:", err);
      setError(err instanceof Error ? err.message : "Failed to delete tour");
    }
  };

  if (loading) return <div>Loading tours...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Our Tours</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCreateTour}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="mr-2" size={20} />
            Create Tour
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <div
            key={tour.id}
            onClick={() => handleTourClick(tour.id)}
            className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white border rounded-lg overflow-hidden relative"
          >
            {tour.image_url && (
              <Image
                width={600}
                height={500}
                src={tour.image_url}
                alt={tour.translations[locale]?.name || "Tour Image"}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">
                {tour.translations[locale]?.name || "Unnamed Tour"}
              </h2>
              <p className="text-gray-600 mb-2">
                Destination:{" "}
                {tour.translations[locale]?.destination || "Not specified"}
              </p>
              {tour.duration && (
                <p className="text-gray-600">Duration: {tour.duration} days</p>
              )}
              {tour.total_price && (
                <p className="text-green-600 font-bold mt-2">
                  Price: ${tour.total_price}
                </p>
              )}
            </div>
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={(e) => handleDeleteTour(tour.id, e)}
                className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                title="Delete Tour"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
