import { Card, CardContent } from "@/src/components/ui/card";
import { Tour } from "@/src/types/tours";
import Image from "next/image";
import { useState, useEffect } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";

export default function Gallery({ data }: { data: Tour }) {
  const gallery = data.gallery || [];
  const [isMobile, setIsMobile] = useState(false);
  const [loadedGalleryImages, setLoadedGalleryImages] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleGalleryImageLoad = (index: number) => {
    setLoadedGalleryImages((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  const limit = isMobile ? 4 : 6;

  return (
    <>
      {gallery.length > 0 && (
        <Card className="w-full md:h-[400px]">
          <CardContent className="p-4 md:p-6">
            <PhotoProvider>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                {gallery.slice(0, limit).map((item, index) => {
                  const isLastItem = index === limit - 1;
                  const showOverlay = isLastItem && gallery.length > limit;

                  return (
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
                            } ${showOverlay ? "blur-xs" : ""}`}
                            onLoad={() => handleGalleryImageLoad(index)}
                          />
                          {showOverlay && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="text-center text-white">
                                <p className="text-lg font-medium">
                                  View all photos
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </PhotoView>
                  );
                })}
              </div>
            </PhotoProvider>
          </CardContent>
        </Card>
      )}
    </>
  );
}
