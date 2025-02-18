import Image from "next/image";
import { useState } from "react";
import { PhotoView } from "react-photo-view";

export default function MainImage({ data }: any) {
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  return (
    <>
      <div className="w-full h-[250px] md:h-[500px] rounded-lg overflow-hidden">
        <PhotoView src={`https://api.daudtravel.com${data.image}`}>
          <div className="relative w-full h-full">
            {!mainImageLoaded && (
              <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
            )}
            <Image
              src={`https://api.daudtravel.com${data.image}`}
              alt="Tour main view"
              fill
              priority
              className={`w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${
                mainImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setMainImageLoaded(true)}
            />
          </div>
        </PhotoView>
      </div>
    </>
  );
}
