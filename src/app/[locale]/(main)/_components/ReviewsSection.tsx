"use client"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";

const reviews = [
  {
    id: 1,
    rating: 5,
    comment:
    "Thank you to everyone at Davut Travel for such a pleasant tour 🩷🩷 I want to visit many more beautiful corners of Georgia with you, you are the best",
  },
  {
    id: 2,
    rating: 4,
    comment:
      "رحلة ممتازة والسائق عمر يمتاز باللغه العربيه وممتع للغايه",
  },
  {
    id: 3,
    rating: 5,
    comment:
      "Mashallah, their service is very upscale, beautiful places, and in addition to that, good manners, may God grant them success.",
  },
  {
    id: 4,
    rating: 5,
    comment:
      "داوود تعاملت معه شخص محترم واذا هو مشغول يرسل عليك سايق محترم ولا يقصر ب اي حاجه تبيها ، من واقع تجربه انصحكم فيه وبالسعر سمح ولا يقصر . اشكرك اخ داوود",
  },
  {
    id: 5,
    rating: 4,
    comment:
      "شركة رائعة جدا.  والأهم من ذلك أن لديهم سائقين مسلمين",
  },
  {
    id: 6,
    rating: 5,
    comment:
    "فريق متعاون وممتاز ويساعدك في إيجاد أنسب الأسعار ويأخذك الى اماكن جميلة وممتعه للتنزه",
  }
];

const ReviewsSection = () => {
  const t = useTranslations("main");

  const buttonVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.5,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <section className="md:pt-12 md:pb-20 pb-12 flex w-full flex-col items-center">
      <motion.h1 
        className="text-2xl md:text-3xl text-center mb-5 md:mb-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={buttonVariants}
      >
        {t("guestReviews")}
      </motion.h1>
      <Carousel
        opts={{
          align: "start",
        }}
        className="mt-6 w-full p-0"
      >
        <CarouselContent className="gap-2 md:gap-4 mx-4 md:mx-20">
          {reviews.map((item, index) => (
            <CarouselItem
              key={index}
              className="w-full rounded-xl border border-gray-300 bg-[#f2f5ff] md:basis-1/2 lg:basis-1/3"
            >
              <div className="flex h-full flex-col justify-between p-6">
                <div>
                  <div className="mb-4 flex items-center">
                    {[...Array(item.rating)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="md:mb-4 mb-2 text-xs md:text-sm text-gray-600">{item.comment}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block md:absolute -top-20 md:right-20 lg:right-40">
          <CarouselPrevious className="bg-mainGradient text-white w-10 h-10 border-white rounded-md border hover:bg-mainGradientHover hover:text-white" />
          <CarouselNext className="bg-mainGradient text-white w-10 h-10 border-white rounded-md border hover:bg-mainGradientHover hover:text-white" />
        </div>
      </Carousel>
      <motion.div
        className="mt-8 md:mt-12"
        variants={buttonVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.a
          href="https://www.google.com/search?q=daudtravel&sca_esv=d4edb64137185dc1&sxsrf=AHTn8zosC93jIM1PxJvPNvi95IuSfElHWw%3A1739182646947&ei=NtKpZ4a8ObeI7NYPwsXrgQs&ved=0ahUKEwiGr_ue8LiLAxU3BNsEHcLiOrAQ4dUDCBA&uact=5&oq=daudtravel&gs_lp=Egxnd3Mtd2l6LXNlcnAiCmRhdWR0cmF2ZWwyBBAjGCcyBRAAGO8FMgUQABjvBTIFEAAY7wVIuRNQpAhYqxJwBHgAkAEAmAHVAaAB8guqAQUwLjcuMrgBA8gBAPgBAZgCDaAClQzCAggQABiwAxjvBcICCxAAGIAEGLADGKIEwgIKECMYgAQYJxiKBcICCxAuGIAEGJECGIoFwgILEAAYgAQYkQIYigXCAgsQABiABBixAxiKBcICDhAAGIAEGLEDGIMBGIoFwgILEAAYgAQYsQMYgwHCAggQABiABBixA8ICERAuGIAEGJECGMcBGIoFGK8BwgIKEC4YgAQYQxiKBcICERAuGIAEGLEDGNEDGIMBGMcBwgILEC4YgAQYsQMY1ALCAhAQABiABBixAxhDGIMBGIoFwgIFEAAYgATCAggQLhiABBjUAsICBRAuGIAEwgIHEC4YgAQYCsICBxAAGIAEGArCAgcQABiABBgNwgIJEAAYgAQYChgNwgIGEAAYDRgewgIIEAAYgAQYogSYAwCIBgGQBgWSBwU0LjcuMqAHm2g&sclient=gws-wiz-serp#lrd=0x406787f6f7466e93:0x69bea43bb941487c,1,,,,"
          target="_blank"
          rel="noopener noreferrer"
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
        >
          <Button className="bg-mainGradient hover:bg-mainGradientHover text-white px-6 py-2 text-sm md:text-base rounded-md transition-all duration-300">
            {t("viewAllReviews")}
          </Button>
        </motion.a>
      </motion.div>
    </section>
  );
};

export default ReviewsSection;