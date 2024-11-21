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
    <div className="z-10 flex h-full w-full flex-col items-center py-10 px-24">
      <Carousel opts={{ loop: true }} className="mt-6 h-full w-full md:mt-14">
        <CarouselContent className="w-full">
          {data.map((item, index) => (
            <CarouselItem key={index} className="md:basis-1/4  px-5">
              <CardContent className="flex items-center justify-center   p-0">
                <Image
                  src={item.img}
                  alt={item.alt}
                  className="h-[250px] w-full  object-cover"
                />
              </CardContent>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="hidden md:block">
          <CarouselPrevious className="bg-mainGradient text-white w-10 h-10 border-white border hover:bg-mainGradientHover hover:text-white" />
          <CarouselNext className="bg-mainGradient text-white w-10 h-10 border-white border hover:bg-mainGradientHover hover:text-white" />
        </div>
      </Carousel>
    </div>
  );
}
