import { useRouter } from "next/navigation";
import {
  Plus,
  Loader2,
  Pencil,
  Calendar,
  Trash,
  ArrowRight,
} from "lucide-react";
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

  const { data, isLoading, error } = useQuery({
    queryKey: ["transfers"],
    queryFn: transfersAPI.get,
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
            <div className="col-span-5">მარშრუტი</div>
            <div className="col-span-2">თარიღი</div>
            <div className="col-span-2">ჯავშნის საფასური</div>
            <div className="col-span-2">სრული ღირებულება</div>
            <div className="col-span-1">მოქმედებები</div>
          </div>

          <div className="space-y-4">
            {transfers.map((transfer: Transfer) => (
              <Card
                key={transfer.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5">
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
                      <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm">
                        {new Date(transfer.date).toLocaleDateString("ka-GE")}
                      </span>
                    </div>

                    <div className="col-span-2 font-medium">
                      {transfer.reservation_price}₾
                    </div>

                    <div className="col-span-2 font-medium">
                      {transfer.total_price}₾
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
