"use client";

import { CardContent } from "@/src/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import Carting from "@img/images/Carting.jpg";
import Piaza from "@img/images/Piaza.jpg";
import Bicy from "@img/images/Bicy.jpg";
import Boat from "@img/images/Boat.jpg";
import Family from "@img/images/Family.jpg";
import Image from "next/image";

export default function Gallery() {
  const data = [
    { img: Carting, alt: "wineTour" },
    { img: Piaza, alt: "wineTour" },
    { img: Bicy, alt: "wineTour" },
    { img: Family, alt: "wineTour" },
    { img: Boat, alt: "wineTour" },
  ];

  return (
    <div className="z-10 flex h-full w-full flex-col items-center py-16">
      <Carousel opts={{ loop: true }} className="mt-6 w-full">
        <CarouselContent className="w-full">
          {data.map((item, index) => (
            <CarouselItem key={index} className="md:basis-1/4 px-4">
              <CardContent className="flex items-center justify-center p-0">
                <Image
                  src={item.img}
                  alt={item.alt}
                  className="h-[250px] w-full object-cover rounded-lg shadow-lg"
                />
              </CardContent>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Fixed navigation buttons */}
        <div className="absolute top-1/2 left-40 z-20 transform -translate-y-1/2">
          <CarouselPrevious className="bg-mainGradient text-white w-10 h-10 border-white border hover:bg-mainGradientHover hover:text-white rounded-full" />
        </div>
        <div className="absolute top-1/2  right-40 z-20 transform -translate-y-1/2">
          <CarouselNext className="bg-mainGradient text-white w-10 h-10 border-white border hover:bg-mainGradientHover hover:text-white rounded-full" />
        </div>
      </Carousel>
    </div>
  );
}
