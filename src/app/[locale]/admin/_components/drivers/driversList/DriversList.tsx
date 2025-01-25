import { useRouter } from "next/navigation";
import { Plus, Loader2, Pencil, User, Trash } from "lucide-react";
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
import { axiosInstance } from "@/src/utlis/axiosInstance";

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  image?: string;
}

const api = {
  fetchDrivers: async () => {
    const response = await axiosInstance.get(`/driversAll`);
    return response.data;
  },
};

export function DriversList() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["drivers"],
    queryFn: api.fetchDrivers,
  });

  const handleEditDriver = (driverId: string) => {
    router.push(`?drivers=${driverId}`);
  };

  const handleCreateDriver = () => {
    router.push("?drivers=createDriver");
  };

  const handleDeleteDriver = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/drivers/${id}`);
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    } catch (error) {
      console.error("Failed to delete driver:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const drivers = data?.data?.drivers || [];

  return (
    <div className="container mx-auto px-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">მძღოლები</h1>
        <Button
          onClick={handleCreateDriver}
          className="flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          <span>მძღოლის დამატება</span>
        </Button>
      </div>
      {drivers.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg mb-4">მძღოლები არ მოიძებნა</p>
          <Button onClick={handleCreateDriver} variant="outline">
            დაამატე პირველი მძღოლი
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-100 rounded-lg font-medium text-sm text-gray-600">
            <div className="col-span-1">სურათი</div>
            <div className="col-span-5">სახელი</div>
            <div className="col-span-4">გვარი</div>
            <div className="col-span-2">მოქმედებები</div>
          </div>

          <div className="space-y-4">
            {drivers.map((driver: Driver) => (
              <Card
                key={driver.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden">
                        {driver.image ? (
                          <Image
                            src={`https://api.daudtravel.com${driver.image}`}
                            alt={`${driver.firstName} ${driver.lastName}`}
                            fill
                            className="object-cover rounded-full"
                            priority={false}
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-span-5">
                      <span className="font-semibold">
                        {driver.firstName || "უცნობი"}
                      </span>
                    </div>

                    <div className="col-span-4">
                      <span className="font-semibold">
                        {driver.lastName || "უცნობი"}
                      </span>
                    </div>

                    <div className="col-span-2 flex justify-end">
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
                            <AlertDialogTitle>მძღოლის წაშლა</AlertDialogTitle>
                            <AlertDialogDescription>
                              დარწმუნებული ხართ რომ გსურთ მძღოლის წაშლა?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>გაუქმება</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteDriver(driver.id)}
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
                        onClick={() => handleEditDriver(driver.id)}
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

export default DriversList;
