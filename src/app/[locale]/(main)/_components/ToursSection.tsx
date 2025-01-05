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
import PoPularToursLoader from "@/src/components/shared/loader/PoPularToursLoader";
import { useParams } from "next/navigation";

export default function ToursSection() {
  const t = useTranslations("main");
  const params = useParams();
  const locale = params.locale;

  const { data: toursData, isLoading } = useQuery({
    queryKey: ["tours", "list"],
    queryFn: async () => {
      const response = await axiosInstance.get("/tours", {
        params: {
          locale: locale,
        },
      });
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
    <section className="w-full py-10 md:pt-12 lg:pt-20 pb-12 flex flex-col gap-8 md:gap-16 bg-[#f2f5ff]">
      <motion.div
        className="w-full md:px-20 flex justify-between items-center px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="flex flex-col gap-2">
          <motion.h1
            variants={headerVariants}
            className="text-xl md:text-3xl lg:text-4xl font-bold text-start"
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
      {isLoading ? (
        <PoPularToursLoader />
      ) : (
        <motion.div
          className="flex justify-center items-center relative md:px-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Carousel opts={{ loop: false }} className="w-full">
            <CarouselContent className="z-10  md:px-20">
              {toursData?.data?.tours?.map((tour: Tour, index: number) => (
                <CarouselItem
                  key={tour.id}
                  className="lg:basis-1/2 md:basis-1/2 xl:basis-1/3 md:pr-7 md:pl-0 px-4 lg:pr-10 lg:pl-0 cursor-pointer hover:z-20"
                >
                  <motion.div
                    className="relative group overflow-hidden rounded-xl h-[250px] md:h-[340px]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    viewport={{ once: true }}
                  >
                    <CardContent className="p-0 h-full ">
                      <Link href={`/tours/${tour.id}`}>
                        <Image
                          src={`http://localhost:3001${tour.image}`}
                          alt={tour.localizations[0].destination}
                          fill
                          className="object-cover"
                        />
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end justify-between"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="p-4">
                            <motion.div
                              className="flex flex-row gap-2 items-center"
                              initial={{ x: -20, opacity: 0 }}
                              whileInView={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.4 }}
                            >
                              <Location className="fill-white w-5 h-5" />
                              <h3 className="text-white text-lg font-semibold">
                                {tour.localizations[0].destination}
                              </h3>
                            </motion.div>
                          </div>
                          <motion.div
                            className="text-white text-sm font-medium p-4 hover:underline transition-all duration-300"
                            initial={{ x: 20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                          >
                            {t("viewMore")}
                          </motion.div>
                        </motion.div>
                      </Link>
                    </CardContent>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <motion.div
              className="hidden md:block md:absolute md:-top-32 lg:-top-28 md:right-36 z-30"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <CarouselPrevious className="bg-mainGradient text-white w-8 h-8 lg:w-10 lg:h-10 border-white border hover:bg-mainGradientHover hover:text-white hover:shadow-lg rounded-md transition-all duration-300" />
              <CarouselNext className="bg-mainGradient text-white w-8 h-8 lg:w-10 lg:h-10 border-white border hover:bg-mainGradientHover hover:text-white hover:shadow-lg rounded-md transition-all duration-300" />
            </motion.div>
          </Carousel>
        </motion.div>
      )}
    </section>
  );
}
