"use client";

import Batumi from "@img/images/Batumi.jpg";
import Svaneti from "@img/images/Svaneti.jpg";
import Image from "next/image";
import { motion } from "framer-motion";
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
  ];

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const underlineVariants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="w-full py-10 md:pt-24 pb-12 md:px-0 flex flex-col gap-8 md:gap-16">
      <motion.div
        className="w-full lg:px-20 flex justify-between items-center px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="flex flex-col gap-2">
          <motion.h1
            variants={headerVariants}
            className="text-4xl md:text-4xl font-bold text-start"
          >
            Popular Destinations
          </motion.h1>
          <motion.div
            variants={underlineVariants}
            className="h-[2px] w-80 md:w-[600px] bg-mainGradient"
          />
          <motion.p variants={headerVariants} transition={{ delay: 0.2 }}>
            Most popular destinations around the world, from historical places
            to natural wonders.
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        className="flex justify-center items-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <Carousel className="w-full">
          <CarouselContent className="pl-4 pr-12 md:pr-32 xl:pr-52 md:pl-6">
            {tours.map((tour, index) => (
              <CarouselItem
                key={tour.id}
                className="md:basis-1/3 xl:basis-1/3 xl:pl-8 px-2"
              >
                <motion.div
                  className="relative group overflow-hidden rounded-xl cursor-pointer h-[400px]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 * index,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Image
                    src={tour.img}
                    alt={tour.alt}
                    fill
                    className="object-cover transition-transform duration-300 h-full group-hover:scale-110 group-hover:brightness-75"
                  />
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-10 flex items-end justify-between"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 * index }}
                  >
                    <div className="p-4">
                      <motion.div
                        className="flex flex-row gap-1 items-center relative"
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 * index }}
                      >
                        <Location className="fill-white w-5 h-5" />
                        <h3 className="text-white text-xl">{tour.name}</h3>
                      </motion.div>
                    </div>
                    <motion.div
                      className="text-white text-sm font-medium p-4 hover:underline"
                      initial={{ x: 20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 * index }}
                    >
                      View More
                    </motion.div>
                  </motion.div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <motion.div
            className="hidden md:block md:absolute -top-20 md:right-20 lg:right-40"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <CarouselPrevious className="bg-mainGradient text-white w-10 h-10 border-white border hover:bg-mainGradientHover hover:text-white" />
            <CarouselNext className="bg-mainGradient text-white w-10 h-10 border-white border hover:bg-mainGradientHover hover:text-white" />
          </motion.div>
        </Carousel>
      </motion.div>
    </section>
  );
}
