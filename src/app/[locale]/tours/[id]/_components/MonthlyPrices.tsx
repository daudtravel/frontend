/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Input } from "@/src/components/ui/input";
import { format } from "date-fns";
import { ka } from "date-fns/locale";
import { Minus, Plus, Calendar as CalendarIcon } from "lucide-react";

const BookingCalendar = ({
  group_prices,
  individual_prices,
  type,
  currentMonth,
}: any) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPersonCount, setSelectedPersonCount] = useState(1);
  const [rooms, setRooms] = useState<{ [key: string]: number }>({});
  const [paymentOption, setPaymentOption] = useState("full");

  const getCurrentMonthGroupPrices = () => {
    const monthKey = currentMonth || (new Date().getMonth() + 1).toString();
    return (
      group_prices?.[monthKey] || {
        total_price: 0,
        reservation_price: 0,
        discounted_price: 0,
      }
    );
  };

  const currentGroupPrices = getCurrentMonthGroupPrices();

  useEffect(() => {
    if (type && selectedDate) {
      const monthKey = (selectedDate.getMonth() + 1).toString();
      const roomPrices = individual_prices?.[monthKey]?.room_prices || {};

      const initialRoomState: { [key: string]: number } = {};
      Object.keys(roomPrices).forEach((roomType) => {
        initialRoomState[roomType] = 0;
      });

      setRooms(initialRoomState);
    }
  }, [type, selectedDate, individual_prices]);

  const getMonthPrices = () => {
    if (!selectedDate) return null;
    const monthKey = (selectedDate.getMonth() + 1).toString();
    return individual_prices?.[monthKey] || { per_person: {}, room_prices: {} };
  };

  const currentIndividualPrices = getMonthPrices();

  const updateRoomCount = (roomType: string, increment: number) => {
    setRooms((prev) => ({
      ...prev,
      [roomType]: Math.max(0, (prev[roomType] || 0) + increment),
    }));
  };

  const calculateTotalPrice = () => {
    if (type) {
      if (!currentIndividualPrices || !selectedDate) return 0;

      const perPersonPrice =
        currentIndividualPrices.per_person?.[selectedPersonCount] || 0;
      const roomsTotal = Object.entries(rooms).reduce(
        (total, [roomType, count]) => {
          const roomPrice =
            currentIndividualPrices.room_prices?.[roomType] || 0;
          return total + roomPrice * count;
        },
        0
      );
      return perPersonPrice * selectedPersonCount + roomsTotal;
    } else {
      if (paymentOption === "reservation") {
        return currentGroupPrices.reservation_price * selectedPersonCount;
      } else if (
        paymentOption === "full" &&
        currentGroupPrices.discounted_price
      ) {
        return currentGroupPrices.discounted_price * selectedPersonCount;
      } else {
        return (currentGroupPrices.total_price || 0) * selectedPersonCount;
      }
    }
  };

  const calculateRemainingAmount = () => {
    if (
      paymentOption === "reservation" &&
      currentGroupPrices.total_price > currentGroupPrices.reservation_price
    ) {
      return (
        (currentGroupPrices.total_price -
          currentGroupPrices.reservation_price) *
        selectedPersonCount
      );
    }
    return 0;
  };

  const getRoomTypeName = (roomType: string): string => {
    const roomTypeMap: { [key: string]: string } = {
      "1": "ერთადგილიანი ოთახი",
      "2": "ორადგილიანი ოთახი",
      "3": "სამადგილიანი ოთახი",
      "4": "ოთხადგილიანი ოთახი",
      "5": "ხუთადგილიანი ოთახი",
    };
    return roomTypeMap[roomType] || `ოთახი ${roomType}`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <Card className="w-full lg:w-2/3">
        <CardContent className="p-4">
          {type ? (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">აირჩიეთ თარიღი</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <Input
                        value={
                          selectedDate
                            ? format(selectedDate, "dd MMMM yyyy", {
                                locale: ka,
                              })
                            : ""
                        }
                        readOnly
                        className="w-full cursor-pointer"
                        placeholder="აირჩიეთ თარიღი"
                      />
                      <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate || undefined}
                      className="rounded-md border"
                      onSelect={(day) => setSelectedDate(day || null)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {selectedDate && currentIndividualPrices && (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">
                      პირების რაოდენობა და ფასი
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {Object.entries(
                        currentIndividualPrices.per_person || {}
                      ).map(([count, price]) => (
                        <button
                          key={count}
                          onClick={() =>
                            setSelectedPersonCount(parseInt(count))
                          }
                          className={`p-2 rounded-md border text-sm transition-all duration-200
                            ${
                              selectedPersonCount === parseInt(count)
                                ? "border-mainGradient bg-mainGradient/50"
                                : "border-gray-200 hover:border-mainGradientHover"
                            }
                            hover:shadow-sm`}
                        >
                          <div className="font-medium">{count} პირი</div>
                          <div className="text-xs text-gray-600">
                            ₾{price as number}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      ოთახების არჩევა
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {Object.entries(
                        currentIndividualPrices.room_prices || {}
                      ).map(([roomType, price]) => (
                        <Card key={roomType} className="p-3">
                          <div className="flex flex-col">
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">
                                {getRoomTypeName(roomType)}
                              </span>
                              <span className="text-sm text-gray-600">
                                ₾{price as number}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateRoomCount(roomType, -1)}
                                disabled={(rooms[roomType] || 0) <= 0}
                                className="h-7 w-7"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="text-base font-semibold min-w-[2rem] text-center">
                                {rooms[roomType] || 0}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateRoomCount(roomType, 1)}
                                className="h-7 w-7"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  პირების რაოდენობა
                </h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setSelectedPersonCount((prev) => Math.max(1, prev - 1))
                    }
                    disabled={selectedPersonCount <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-base font-semibold min-w-[2rem] text-center">
                    {selectedPersonCount}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedPersonCount((prev) => prev + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">გადახდის ოფციები</h3>
                <div className="space-y-3">
                  <Card
                    className={`p-3 cursor-pointer transition-all ${paymentOption === "full" ? "ring-2 ring-mainGradient" : "hover:border-mainGradientHover"}`}
                    onClick={() => setPaymentOption("full")}
                  >
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">სრული გადახდა</div>
                          <div className="text-sm text-gray-600">
                            ერთჯერადი გადახდა ფასდაკლებით
                          </div>
                        </div>
                        <div className="text-mainGradient font-semibold">
                          ₾
                          {(currentGroupPrices.discounted_price ||
                            currentGroupPrices.total_price ||
                            0) * selectedPersonCount}
                        </div>
                      </div>
                    </div>
                  </Card>
                  {currentGroupPrices.reservation_price > 0 && (
                    <Card
                      className={`p-3 cursor-pointer transition-all ${paymentOption === "reservation" ? "ring-2 ring-mainGradient" : "hover:border-mainGradientHover"}`}
                      onClick={() => setPaymentOption("reservation")}
                    >
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">
                              სარეზერვაციო თანხა
                            </div>
                            <div className="text-sm text-gray-600">
                              დარჩენილი თანხა გადაიხდება მოგვიანებით
                            </div>
                          </div>
                          <div className="font-semibold">
                            ₾
                            {currentGroupPrices.reservation_price *
                              selectedPersonCount}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">ფასის დეტალები</h3>
                <Card className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>
                        სრული ღირებულება ({selectedPersonCount} პირი):
                      </span>
                      <span className="font-semibold">
                        ₾
                        {(currentGroupPrices.total_price || 0) *
                          selectedPersonCount}
                      </span>
                    </div>

                    {paymentOption === "reservation" &&
                      currentGroupPrices.reservation_price > 0 && (
                        <>
                          <div className="flex justify-between">
                            <span>სარეზერვაციო თანხა:</span>
                            <span className="font-semibold">
                              ₾
                              {currentGroupPrices.reservation_price *
                                selectedPersonCount}
                            </span>
                          </div>
                          <div className="flex justify-between text-orange-600">
                            <span>
                              დარჩენილი თანხა (გადაიხდება მოგვიანებით):
                            </span>
                            <span className="font-semibold">
                              ₾{calculateRemainingAmount()}
                            </span>
                          </div>
                        </>
                      )}
                    {paymentOption === "full" &&
                      currentGroupPrices.discounted_price &&
                      currentGroupPrices.discounted_price <
                        currentGroupPrices.total_price && (
                        <div className="flex justify-between text-mainGradient">
                          <span>დაზოგილი თანხა:</span>
                          <span className="font-semibold">
                            ₾
                            {(currentGroupPrices.total_price -
                              currentGroupPrices.discounted_price) *
                              selectedPersonCount}
                          </span>
                        </div>
                      )}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="w-full lg:w-1/3">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">დაჯავშნის დეტალები</h3>

          {selectedDate || !type ? (
            <div className="space-y-3">
              {type && selectedDate && (
                <div className="pb-3 border-b">
                  <div className="text-sm font-medium mb-1">არჩეული თარიღი</div>
                  <div className="text-sm">
                    {selectedDate.toLocaleDateString("ka-GE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              )}

              <div className="pb-3 border-b">
                <div className="text-sm font-medium mb-1">
                  პირების რაოდენობა
                </div>
                <div className="flex justify-between text-sm">
                  <span>{selectedPersonCount} პირი</span>
                  {type &&
                    currentIndividualPrices?.per_person?.[
                      selectedPersonCount
                    ] && (
                      <span className="font-medium">
                        ₾
                        {currentIndividualPrices.per_person[
                          selectedPersonCount
                        ] * selectedPersonCount}
                      </span>
                    )}
                </div>
              </div>

              {type &&
                selectedDate &&
                //eslint-disable-next-line
                Object.entries(rooms).some(([_, count]) => count > 0) && (
                  <div className="pb-3 border-b">
                    <div className="text-sm font-medium mb-1">
                      არჩეული ოთახები
                    </div>
                    {Object.entries(rooms).map(
                      ([roomType, count]) =>
                        count > 0 && (
                          <div
                            key={roomType}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {getRoomTypeName(roomType)}
                              {" x"}
                              {count}
                            </span>
                            <span className="font-medium">
                              ₾
                              {(currentIndividualPrices?.room_prices?.[
                                roomType
                              ] || 0) * count}
                            </span>
                          </div>
                        )
                    )}
                  </div>
                )}
              {!type && (
                <div className="pb-3 border-b">
                  <div className="text-sm font-medium mb-1">
                    გადახდის მეთოდი
                  </div>
                  <div className="text-sm">
                    {paymentOption === "full"
                      ? "სრული გადახდა"
                      : "სარეზერვაციო თანხა"}
                    {paymentOption === "reservation" && (
                      <div className="text-xs text-gray-600 mt-1">
                        დარჩენილი თანხა: ₾{calculateRemainingAmount()}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <div className="flex justify-between font-bold">
                  <span>ჯამი:</span>
                  <span className="text-mainGradient">
                    ₾{calculateTotalPrice()}
                  </span>
                </div>
              </div>

              <Button className="w-full mt-4">დაჯავშნა</Button>
            </div>
          ) : (
            <div className="text-sm text-gray-500">გთხოვთ აირჩიოთ თარიღი</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingCalendar;
