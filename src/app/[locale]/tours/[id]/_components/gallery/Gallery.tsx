import { Card, CardContent } from "@/src/components/ui/card";
import { useImageLoader } from "@/src/hooks/useImageLoader";
import Image from "next/image";
import React, { useMemo } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";

interface GalleryProps {
  data: {
    images: string[];
    mainImageSrc: string;
  };
}

const Gallery = React.memo<GalleryProps>(({ data }) => {
  const { handleImageLoad, isImageLoaded } = useImageLoader();

  const galleryConfig = useMemo(() => {
    const displayLimit = 8;
    const hasMoreImages = data.images.length > displayLimit;
    const displayImages = data.images.slice(
      0,
      hasMoreImages ? displayLimit - 1 : displayLimit
    );
    const remainingCount = data.images.length - (displayLimit - 1);

    return {
      displayImages,
      hasMoreImages,
      remainingCount,
      hiddenImages: data.images.slice(displayLimit - 1),
    };
  }, [data.images]);

  if (data.images.length === 0) {
    return null;
  }

  return (
    <Card className="w-full md:h-auto">
      <CardContent className="p-4 md:p-6">
        <PhotoProvider>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {galleryConfig.displayImages.map((imageSrc, index) => (
              <PhotoView key={`display-${index}`} src={imageSrc}>
                <div className="relative h-[120px] md:h-[160px] rounded-lg border border-gray-300 overflow-hidden cursor-pointer">
                  {!isImageLoaded(imageSrc) && (
                    <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
                  )}
                  <div className="relative w-full h-full">
                    <Image
                      src={imageSrc || "/placeholder.svg"}
                      alt={`Gallery image ${index + 1}`}
                      fill
                      loading="lazy"
                      className={`object-cover transition-all duration-300 ${
                        isImageLoaded(imageSrc) ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => handleImageLoad(imageSrc)}
                    />
                  </div>
                </div>
              </PhotoView>
            ))}

            {galleryConfig.hasMoreImages && (
              <PhotoView src={galleryConfig.hiddenImages[0]}>
                <div className="relative h-[120px] md:h-[160px] rounded-lg border border-gray-300 overflow-hidden cursor-pointer">
                  <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                    <span className="text-white font-semibold text-xl">
                      +{galleryConfig.remainingCount}
                    </span>
                  </div>
                  <div className="relative w-full h-full">
                    <Image
                      src={galleryConfig.hiddenImages[0] || "/placeholder.svg"}
                      alt="Additional images"
                      fill
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                </div>
              </PhotoView>
            )}
          </div>

          {galleryConfig.hiddenImages.slice(1).map((imageSrc, index) => (
            <PhotoView key={`hidden-${index}`} src={imageSrc} />
          ))}
        </PhotoProvider>
      </CardContent>
    </Card>
  );
});

Gallery.displayName = "Gallery";

export default Gallery;
