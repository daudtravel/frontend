import renderDescription from "@/src/components/textEditor/RenderText";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { ArrowDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";

export default function Description({ data }: any) {
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false);
  const description =
    data.localizations?.[0]?.description || "No description available";
  const nextLocations = data.localizations[0]?.next_location || [];
  const startLocation = data.localizations[0]?.start_location;
  const endLocation = data.localizations.length - 1;

  const allDestinations = [startLocation, ...nextLocations];

  return (
    <>
      <Card className="w-full">
        <CardContent className="p-4 md:p-6 flex flex-col h-full">
          <h1>start date</h1>
          <div className="flex flex-col flex-grow">
            {nextLocations.length > 0 && (
              <>
                <div className="xl:hidden relative py-4">
                  <div className="absolute left-0 right-0 top-1/3 h-2 bg-white border-gray-300 border rounded-lg transform -translate-y-1/2" />
                  <div className="flex justify-between items-center relative">
                    <div className="flex flex-col items-center relative">
                      <div className="w-4 h-4 bg-orange-500 rounded-full z-10" />
                      <span className="text-xs font-medium text-center w-20 mt-2">
                        {startLocation}
                      </span>
                    </div>
                    {nextLocations.length > 1 && (
                      <div
                        className="flex flex-col items-center relative px-2 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setIsDestinationsOpen(true)}
                      >
                        <MoreHorizontal className="w-5 h-5 text-main z-10" />
                        <span className="text-xs font-medium text-gray-500 text-center mt-2">
                          +{nextLocations.length - 1} stops
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col items-center relative">
                      <div className="w-4 h-4 bg-orange-500 rounded-full z-10" />
                      <span className="text-xs font-medium text-center w-20 mt-2">
                        {endLocation}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden xl:block relative py-4">
                  <div className="absolute left-0 right-0 top-1/3 h-2 bg-white border-gray-300 border rounded-lg transform -translate-y-1/2" />
                  <div className="relative flex justify-between items-center">
                    {[startLocation, ...nextLocations].map(
                      (location, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center relative"
                        >
                          <div className="w-4 h-4 bg-orange-500 rounded-full z-10" />
                          <span className="text-xs font-medium text-center w-20 mt-2 line-clamp-2">
                            {location}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </>
            )}
            <span className="text-gray-600 mb-6 md:mb-8 text-sm flex-grow">
              {renderDescription(description)}
            </span>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isDestinationsOpen} onOpenChange={setIsDestinationsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tour Destinations</DialogTitle>
          </DialogHeader>
          <div className="relative py-6">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-200" />
            {allDestinations.map((location, index) => (
              <div
                key={index}
                className="relative flex items-center mb-6 last:mb-0"
              >
                <div className="absolute left-6 -ml-[9px] w-4 h-4 bg-blue-500 rounded-full" />
                {index !== allDestinations.length - 1 && (
                  <ArrowDown className="absolute left-6 -ml-[5px] top-6 w-3 h-3 text-blue-500" />
                )}
                <div className="ml-12">
                  <p className="text-base font-medium">{location}</p>
                  {index === 0 && (
                    <span className="text-sm text-blue-500">
                      Starting point
                    </span>
                  )}
                  {index === allDestinations.length - 1 && (
                    <span className="text-sm text-blue-500">
                      Final destination
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
