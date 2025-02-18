import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function Payment({ data }: any) {
  const [personCount, setPersonCount] = useState(1);
  const [paymentType, setPaymentType] = useState("total");
  const priceData = {
    total_price: 1500,
    reservation_price: 500,
    discounted_price: 1350, // 10% discount
    person_price: 1500,
  };

  const calculatePrice = () => {
    if (paymentType === "total") {
      return (priceData.discounted_price * personCount).toFixed(2);
    } else {
      return (priceData.reservation_price * personCount).toFixed(2);
    }
  };
  return (
    <>
      <>
        {!data.type ? (
          <Card className="w-full mt-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Booking Options</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column - Payment options */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of People
                    </label>
                    <Select
                      value={personCount.toString()}
                      onValueChange={(value) => setPersonCount(parseInt(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select number of people" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "person" : "people"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Option
                    </label>
                    <RadioGroup
                      value={paymentType}
                      onValueChange={setPaymentType}
                      className="flex flex-col space-y-3"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="total" id="option-total" />
                        <Label htmlFor="option-total" className="flex flex-col">
                          <span>Pay Full Amount</span>
                          <span className="text-sm text-green-600">
                            10% discount applied
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem
                          value="reservation"
                          id="option-reservation"
                        />
                        <Label htmlFor="option-reservation">
                          Pay Reservation Only
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Right column - Price summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Price Summary</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Base price per person:
                      </span>
                      <span className="font-medium">
                        ₾{priceData.person_price.toFixed(2)}
                      </span>
                    </div>

                    {personCount > 1 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">People:</span>
                        <span className="font-medium">x{personCount}</span>
                      </div>
                    )}

                    {paymentType === "total" && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total price:</span>
                          <span className="font-medium line-through text-gray-500">
                            ₾{(priceData.total_price * personCount).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Discount:</span>
                          <span className="font-medium text-green-600">
                            -10%
                          </span>
                        </div>
                      </>
                    )}

                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">
                          {paymentType === "reservation"
                            ? "Reservation amount:"
                            : "Discounted total:"}
                        </span>
                        <span className="text-xl font-bold text-orange-500">
                          ₾{calculatePrice()}
                        </span>
                      </div>

                      {paymentType === "reservation" && (
                        <div className="text-sm text-gray-500 mt-2">
                          Remaining balance: ₾
                          {(
                            (priceData.total_price -
                              priceData.reservation_price) *
                            personCount
                          ).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-md"
                  onClick={() => {
                    /* Add booking logic here */
                  }}
                >
                  {paymentType === "reservation"
                    ? "Pay Reservation"
                    : "Book Now"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full mt-6">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4">
                  Contact for Price
                </h2>
                <p className="text-gray-600 mb-4 text-center">
                  This tour's pricing is available on request. Please contact us
                  via WhatsApp for detailed information.
                </p>
                <Button
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-md"
                  onClick={() =>
                    window.open("https://wa.me/1234567890", "_blank")
                  }
                >
                  <MessageCircle size={18} />
                  Contact via WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </>
    </>
  );
}
