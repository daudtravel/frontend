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
import { motion } from "framer-motion";

export default function Gallery() {
  const data = [
    { img: Carting, alt: "wineTour" },
    { img: Piaza, alt: "wineTour" },
    { img: Bicy, alt: "wineTour" },
    { img: Family, alt: "wineTour" },
    { img: Boat, alt: "wineTour" },
  ];

  return (
    <motion.div
      className="z-10 flex h-full w-full flex-col items-center py-16 px-4 md:px-24"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }} // Only triggers when the section enters the viewport
    >
      <Carousel opts={{ loop: true }} className="mt-6 w-full">
        <CarouselContent className="w-full">
          {data.map((item, index) => (
            <CarouselItem key={index} className="md:basis-1/4 px-5">
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
        <div className="absolute top-1/2 left-0 z-20 transform -translate-y-1/2">
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <CarouselPrevious className="bg-mainGradient text-white w-10 h-10 border-white border hover:bg-mainGradientHover hover:text-white rounded-full" />
          </motion.div>
        </div>
        <div className="absolute top-1/2 right-0 z-20 transform -translate-y-1/2">
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <CarouselNext className="bg-mainGradient text-white w-10 h-10 border-white border hover:bg-mainGradientHover hover:text-white rounded-full" />
          </motion.div>
        </div>
      </Carousel>
    </motion.div>
  );
}
