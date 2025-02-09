import { useState } from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { MonthlyPricesProps} from '@/src/types/prices';

const months = [
  "იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი",
  "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"
];

const MonthlyPrices = ({ prices }: MonthlyPricesProps) => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedPriceType, setSelectedPriceType] = useState<'reservation' | 'total' | null>(null);
  const [packetCount, setPacketCount] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState(0);

  const handlePriceSelect = (month: number, priceType: 'reservation' | 'total') => {
    setSelectedMonth(month);
    setSelectedPriceType(priceType);
    const price = priceType === 'total' 
      ? prices[month]?.total_price 
      : prices[month]?.reservation_price;
    setSelectedPrice(price || 0);
  };

  const handleDecrease = () => {
    if (packetCount > 1) {
      setPacketCount(prev => prev - 1);
    }
  };

  const handleIncrease = () => {
    setPacketCount(prev => prev + 1);
  };

  const calculateTotalPrice = () => {
    return selectedPrice * packetCount;
  };

  const calculateDiscountedPrice = () => {
    if (selectedPriceType === 'total') {
      return calculateTotalPrice() * 0.8;
    }
    return calculateTotalPrice();
  };

  return (
    <Card className="w-full mt-4">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">აირჩიე სასურველი დრო და ღირებულება</h3>
      </div>
      <CardContent className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
        <div className="lg:col-span-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-3">
          {months.map((month, index) => {
            const monthData = prices[index + 1] || {};
            const reservationPrice = monthData.reservation_price || 0;
            const totalPrice = monthData.total_price || 0;
            const isSelected = selectedMonth === (index + 1);
            const discountedPrice = totalPrice * 0.8;

            return (
              <div 
                key={index}
                className={`relative rounded-md border p-3 transition-all duration-200 text-sm
                  ${isSelected ? 'border-mainGradient bg-mainGradient/50' : 'border-gray-200'}
                  hover:border-mainGradientHover hover:shadow-sm`}
              >
                <div className="font-medium mb-2">{month}</div>
                {(reservationPrice > 0 || totalPrice > 0) ? (
                  <div className="space-y-2">
                    {reservationPrice > 0 && (
                      <button
                        onClick={() => handlePriceSelect(index + 1, 'reservation')}
                        className={`w-full p-1.5 rounded text-sm transition-colors
                          ${isSelected && selectedPriceType === 'reservation'
                            ? 'bg-mainGradient text-white'
                            : 'bg-gray-50 hover:bg-gray-100'}`}
                      >
                        ჯავშანი: ${reservationPrice}
                      </button>
                    )}
                    {totalPrice > 0 && (
                      <button
                        onClick={() => handlePriceSelect(index + 1, 'total')}
                        className={`w-full p-1.5 rounded text-sm transition-colors
                          ${isSelected && selectedPriceType === 'total'
                            ? 'bg-mainGradient text-white'
                            : 'bg-gray-50 hover:bg-gray-100'}`}
                      >
                        <div>სრული: ${totalPrice}</div>
                        <div className={`${isSelected && selectedPriceType === 'total'
                            ? 'bg-mainGradient text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-red-400'}`}>
                          სრულად გადახდისას: ${discountedPrice}
                        </div>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">არ არის ხელმისაწვდომი</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <Card className="p-4">
            <h4 className="font-semibold text-sm mb-3">Order Summary</h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Number of Packets
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDecrease}
                    disabled={packetCount <= 1}
                    className="h-7 w-7"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-base font-semibold min-w-[2rem] text-center">
                    {packetCount}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleIncrease}
                    className="h-7 w-7"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {selectedPrice > 0 && (
                <div className="space-y-2 pt-3 border-t text-sm">
                  <div className="flex justify-between">
                    <span>Price per packet:</span>
                    <span className="font-medium">${selectedPrice}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Packets:</span>
                    <span className="font-medium">× {packetCount}</span>
                  </div>

                  {selectedPriceType === 'total' && (
                    <>
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">${calculateTotalPrice()}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Pay in full discount (20%):</span>
                        <span>-${(calculateTotalPrice() * 0.2).toFixed(2)}</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between text-base font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-mainGradient">
                      ${calculateDiscountedPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <Button 
                className="w-full mt-2" 
                disabled={!selectedPrice}
                size="default"
              >
                Book Now
              </Button>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyPrices;
