"use client";

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
import { axiosInstance } from "@/src/utlis/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { Tour } from "@/src/types/tours";
import { useTranslations } from "next-intl";
import { CardContent } from "@/src/components/ui/card";
import Link from "next/link";

export default function ToursSection() {
  const t = useTranslations("main");

  const { data: toursData } = useQuery({
    queryKey: ["tours", "list"],
    queryFn: async () => {
      const response = await axiosInstance.get("/tours");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const underlineVariants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="w-full py-10 md:pt-16 lg:pt-24 pb-12 flex flex-col gap-8 md:gap-16">
      <motion.div
        className="w-full lg:px-20 flex justify-between items-center px-4 md:px-7"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="flex flex-col gap-2">
          <motion.h1
            variants={headerVariants}
            className="text-xl md:text-3xl  lg:text-4xl font-bold text-start"
          >
            {t("popularDestinations")}
          </motion.h1>
          <motion.div
            variants={underlineVariants}
            className="h-[2px] w-80 md:w-[600px] bg-mainGradient"
          />
          <motion.p
            className="text-sm"
            variants={headerVariants}
            transition={{ delay: 0.2 }}
          >
            {t("popularDestinationsDesc")}
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        className="flex justify-center items-center relative md:px-7 lg:px-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <Carousel opts={{ loop: true }} className="w-full">
          <CarouselContent className="z-10 px-3">
            {toursData?.data?.tours?.map((tour: Tour, index: number) => (
              <CarouselItem
                key={tour.id}
                className="md:basis-1/3 lg:basis-1/3 cursor-pointer hover:z-20"
              >
                <motion.div
                  className="relative group overflow-hidden rounded-xl h-[350px]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                >
                  <Link href={`/tours/${tour.id}`}>
                    <CardContent className="p-0 h-full">
                      <Image
                        src={`http://localhost:3001${tour.image}`}
                        alt={tour.localizations[0].destination}
                        fill
                        className="object-cover"
                      />
                      <motion.div
                        className="absolute inset-0 bg-black bg-opacity-10 flex items-end justify-between"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-4">
                          <motion.div
                            className="flex flex-row gap-1 items-center"
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                          >
                            <Location className="fill-white w-5 h-5" />
                            <h3 className="text-white text-xl">
                              {tour.localizations[0].destination}
                            </h3>
                          </motion.div>
                        </div>
                        <motion.div
                          className="text-white text-sm font-medium p-4 hover:underline"
                          initial={{ x: 20, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          View More
                        </motion.div>
                      </motion.div>
                    </CardContent>
                  </Link>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <motion.div
            className="hidden md:block md:absolute  md:-top-32 lg:-top-20 md:right-20 lg:right-20 z-30"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <CarouselPrevious className="bg-mainGradient text-white w-8 h-8 lg:w-10 lg:h-10 border-white border hover:bg-mainGradientHover hover:text-white" />
            <CarouselNext className="bg-mainGradient text-white w-8 h-8 lg:w-10 lg:h-10 border-white border hover:bg-mainGradientHover hover:text-white" />
          </motion.div>
        </Carousel>
      </motion.div>
    </section>
  );
}
