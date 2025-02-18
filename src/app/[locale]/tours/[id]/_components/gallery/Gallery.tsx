import { Card, CardContent } from "@/src/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { PhotoView } from "react-photo-view";

export default function Gallery({ data }: any) {
  const gallery = data.gallery || [];
  const [loadedGalleryImages, setLoadedGalleryImages] = useState<
    Record<number, boolean>
  >({});

  const handleGalleryImageLoad = (index: number) => {
    setLoadedGalleryImages((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  return (
    <>
      {gallery.length > 0 && (
        <Card className="w-full h-[500px]">
          <CardContent className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
              გალერია
            </h2>
            <div className="grid grid-cols-5 gap-3 md:gap-5">
              {gallery.map((item, index) => (
                <PhotoView
                  key={index}
                  src={`https://api.daudtravel.com${item}`}
                >
                  <div className="h-[100px] md:h-[100px] rounded-lg overflow-hidden cursor-pointer">
                    <div className="w-full h-full relative">
                      {!loadedGalleryImages[index] && (
                        <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
                      )}
                      <Image
                        src={`https://api.daudtravel.com${item}`}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        loading="lazy"
                        className={`w-full h-full object-cover hover:scale-105 transition-all duration-300 ${
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
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
