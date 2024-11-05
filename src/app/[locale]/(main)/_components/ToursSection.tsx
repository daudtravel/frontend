import Batumi from "@img/images/Batumi.jpg";
import Svaneti from "@img/images/Svaneti.jpg";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { Location } from "@/src/components/svg";

export default function ToursSection() {
  const tours = [
    {
      id: 1,
      name: "Batumi",
      alt: "Paris cityscape",
      img: Batumi,
    },
    {
      id: 2,
      name: "Svaneti",
      alt: "Paris cityscape",
      img: Svaneti,
    },
    {
      id: 3,
      name: "Svaneti",
      alt: "Paris cityscape",
      img: Svaneti,
    },
    {
      id: 4,
      name: "Batumi",
      alt: "Paris cityscape",
      img: Batumi,
    },
    {
      id: 5,
      name: "Svaneti",
      alt: "Paris cityscape",
      img: Svaneti,
    },
    {
      id: 6,
      name: "Batumi",
      alt: "Paris cityscape",
      img: Batumi,
    },
    // ... other tour objects
  ];

  return (
    <section className="w-full py-24 md:px-0 flex flex-col gap-8 md:gap-16">
      <div className="w-full lg:px-20 flex justify-between items-center px-4">
        <div className="flex flex-col gap-2 ">
          <h1 className="text-4xl text-start">Popular Destinations</h1>
          <div className="h-[2px] w-80 md:w-[600px] bg-mainGradient"></div>
          <p>
            Most popular destinations around the world, from historical places
            to natural wonders.
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <Carousel className="w-full">
          <CarouselContent className="pl-4 pr-12 md:pr-32 xl:pr-52 md:pl-6">
            {tours.map((tour) => (
              <CarouselItem
                key={tour.id}
                className="md:basis-1/3 xl:basis-1/3 xl:pl-8 px-2"
              >
                <div className="relative group overflow-hidden rounded-xl cursor-pointer h-[400px]">
                  <Image
                    src={tour.img}
                    alt={tour.alt}
                    fill
                    className="object-cover transition-transform duration-300 h-full group-hover:scale-110 group-hover:brightness-75"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-between">
                    <div className="p-4">
                      <div className="flex flex-row gap-1 items-center relative">
                        <Location className="fill-white w-5 h-5" />
                        <h3 className="text-white text-xl">{tour.name}</h3>
                      </div>
                    </div>
                    <div className="text-white text-sm font-medium p-4 hover:underline">
                      View More
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block md:absolute -top-20 md:right-20 lg:right-40">
            <CarouselPrevious className="bg-mainGradient text-white w-10 h-10 border-white border hover:bg-mainGradientHover hover:text-white" />
            <CarouselNext className="bg-mainGradient text-white w-10 h-10 border-white border hover:bg-mainGradientHover hover:text-white" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
