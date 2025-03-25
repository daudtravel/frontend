import { Card, CardContent } from "@/src/components/ui/card";
import { Tour } from "@/src/types/tours";
import Image from "next/image";
import { useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";

export default function Gallery({ data }: { data: Tour }) {
  const gallery = data.gallery || [];
  const [loadedGalleryImages, setLoadedGalleryImages] = useState<
    Record<number, boolean>
  >({});

  const filteredGallery = gallery.filter((item) => item !== data.image);
  const displayLimit = 8;
  const hasMoreImages = filteredGallery.length > displayLimit;
  const displayGallery = filteredGallery.slice(
    0,
    hasMoreImages ? displayLimit - 1 : displayLimit
  );
  const remainingCount = filteredGallery.length - (displayLimit - 1);

  const handleGalleryImageLoad = (index: number) => {
    setLoadedGalleryImages((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  return (
    <>
      {filteredGallery.length > 0 && (
        <Card className="w-full md:h-auto">
          <CardContent className="p-4 md:p-6">
            <PhotoProvider>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                {displayGallery.map((item, index) => (
                  <PhotoView
                    key={index}
                    src={`https://api.daudtravel.com${item}`}
                  >
                    <div className="relative h-[120px] md:h-[160px] rounded-lg border border-gray-300 overflow-hidden cursor-pointer">
                      {!loadedGalleryImages[index] && (
                        <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
                      )}
                      <div className="relative w-full h-full">
                        <Image
                          src={`https://api.daudtravel.com${item}`}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          loading="lazy"
                          className={`object-cover transition-all duration-300 ${
                            loadedGalleryImages[index]
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                          onLoad={() => handleGalleryImageLoad(index)}
                        />
                      </div>
                    </div>
                  </PhotoView>
                ))}

                {hasMoreImages && (
                  <PhotoView
                    src={`https://api.daudtravel.com${filteredGallery[displayLimit - 1]}`}
                  >
                    <div className="relative h-[120px] md:h-[160px] rounded-lg border border-gray-300 overflow-hidden cursor-pointer">
                      <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                        <span className="text-white font-semibold text-xl">
                          +{remainingCount}
                        </span>
                      </div>
                      <div className="relative w-full h-full">
                        <Image
                          src={`https://api.daudtravel.com${filteredGallery[displayLimit - 1]}`}
                          alt={`Additional images`}
                          fill
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </PhotoView>
                )}
              </div>

              {filteredGallery.slice(displayLimit - 1).map((item, index) => (
                <PhotoView
                  key={`hidden-${index}`}
                  src={`https://api.daudtravel.com${item}`}
                />
              ))}
            </PhotoProvider>
          </CardContent>
        </Card>
      )}
    </>
  );
}
