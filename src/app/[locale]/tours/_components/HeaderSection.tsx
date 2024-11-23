"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Petra from "@img/images/123.jpg";
import { Button } from "@/src/components/ui/button";

export default function HeaderSection() {
  return (
    <section className="relative w-full h-[85vh] sm:h-[70vh] lg:h-[80vh] min-h-[550px]">
      {/* Background Image with Overlay */}
      <Image
        src={Petra}
        priority
        fill
        className="object-cover object-center"
        alt="Destination Landscape"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent sm:from-black/70 sm:via-black/50" />

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="h-full flex flex-col justify-center sm:justify-center space-y-4 sm:space-y-6 
          max-w-[100%] sm:max-w-xl lg:max-w-2xl pt-8 sm:pt-0"
        >
          {/* Animated Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs sm:text-sm lg:text-base text-yellow-400 font-medium tracking-wider uppercase"
          >
            Discover Amazing Places
          </motion.p>

          {/* Animated Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
          >
            Find Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Emotions!
            </span>
          </motion.h1>

          {/* Animated Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm sm:text-base lg:text-lg text-gray-200 max-w-[90%] sm:max-w-xl"
          >
            Embark on unforgettable journeys across Georgia's most stunning
            destinations. From coastal charm to mountain majesty, your next
            adventure awaits.
          </motion.p>

          {/* Animated CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4"
          >
            <Button
              className="px-4 sm:px-6 py-2.5 sm:py-3   h-12 
              text-black text-sm sm:text-base font-semibold rounded-lg transition-colors 
              duration-300 flex items-center justify-center gap-2 group w-full sm:w-auto"
            >
              Explore Tours
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <button
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 
              text-white text-sm sm:text-base font-semibold rounded-lg backdrop-blur-sm 
              transition-colors duration-300 w-full sm:w-auto"
            >
              View Destinations
            </button>
          </motion.div>

          {/* Animated Stats */}
        </div>
      </div>

      {/* Decorative Elements - Adjusted opacity for better visibility on mobile */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 
        bg-gradient-to-t from-white/90 dark:from-gray-900/90 sm:from-white dark:sm:from-gray-900"
      />
    </section>
  );
}
