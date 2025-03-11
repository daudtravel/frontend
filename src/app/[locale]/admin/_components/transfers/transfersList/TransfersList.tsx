import { useParams, useRouter } from "next/navigation";
import { Plus, Loader2, Pencil, Car, Trash, ArrowRight } from "lucide-react";
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
import { Transfer } from "@/src/types/transfer";
import { transfersAPI } from "@/src/routes/transfers";

export function TransfersList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams();
  const locale = params.locale as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["transfers", locale],
    queryFn: () => transfersAPI.get(locale),
  });

  const transfers = data?.data || [];

  const handleDeleteTransfer = async (id: string) => {
    try {
      await transfersAPI.delete(id);
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    } catch (error) {
      console.error("Failed to delete transfer:", error);
    }
  };

  const handleEditTransfer = (transferId: string) => {
    router.push(`?transfers=${transferId}`);
  };

  const handleCreateTransfer = () => {
    router.push("?transfers=createTransfer");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getLowestPrice = (prices: any) => {
    if (!prices) return "N/A";

    const allPrices = [];
    for (const vehicle of ["sedan", "minivan", "vito", "sprinter", "bus"]) {
      if (prices[vehicle]?.season_price)
        allPrices.push(prices[vehicle].season_price);
      if (prices[vehicle]?.off_season_price)
        allPrices.push(prices[vehicle].off_season_price);
    }

    if (allPrices.length === 0) return "N/A";
    return `${Math.min(...allPrices)}$`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getHighestPrice = (prices: any) => {
    if (!prices) return "N/A";

    const allPrices = [];
    for (const vehicle of ["sedan", "minivan", "vito", "sprinter", "bus"]) {
      if (prices[vehicle]?.season_price)
        allPrices.push(prices[vehicle].season_price);
      if (prices[vehicle]?.off_season_price)
        allPrices.push(prices[vehicle].off_season_price);
    }

    if (allPrices.length === 0) return "N/A";
    return `${Math.max(...allPrices)}$`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">ტრანსფერები</h1>
        <Button
          onClick={handleCreateTransfer}
          className="flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          <span>ტრანსფერის დამატება</span>
        </Button>
      </div>

      {transfers.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg mb-4">ტრანსფერები არ მოიძებნა</p>
          <Button onClick={handleCreateTransfer} variant="outline">
            დაამატე პირველი ტრანსფერი
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-100 rounded-lg font-medium text-sm text-gray-600">
            <div className="col-span-6">მარშრუტი</div>
            <div className="col-span-2">ავტომობილი</div>
            <div className="col-span-2">ფასების დიაპაზონი</div>
            <div className="col-span-2">მოქმედებები</div>
          </div>

          <div className="space-y-4">
            {transfers.map((transfer: Transfer) => (
              <Card
                key={transfer.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-6">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {transfer.localizations[0]?.start_location}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <span className="font-semibold">
                          {transfer.localizations[0]?.end_location}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center gap-2">
                      <Car className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm">
                        {Object.keys(transfer.prices || {}).length} ტიპი
                      </span>
                    </div>

                    <div className="col-span-2 font-medium">
                      {getLowestPrice(transfer.prices)} -{" "}
                      {getHighestPrice(transfer.prices)}
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
                            <AlertDialogTitle>
                              ტრანსფერის წაშლა
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              დარწმუნებული ხართ რომ გსურთ ტრანსფერის წაშლა?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>გაუქმება</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteTransfer(transfer.id)}
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
                        onClick={() => handleEditTransfer(transfer.id)}
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

export default TransfersList;
