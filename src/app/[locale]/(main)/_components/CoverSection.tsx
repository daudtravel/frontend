"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { motion } from "framer-motion";

const CoverSection = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    { src: "/images/Svaneti.jpg", alt: "Svaneti" },
    { src: "/images/Batumi.jpg", alt: "Batumi" },
    { src: "/images/River.jpg", alt: "River" },
  ];

  const destinations = [
    { value: "svaneti", label: "Svaneti" },
    { value: "batumi", label: "Batumi" },
    { value: "tbilisi", label: "Tbilisi" },
    { value: "kazbegi", label: "Kazbegi" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full min-h-screen md:h-[800px] overflow-hidden bg-white">
      {/* Background Images */}
      {images.map((image, index) => (
        <motion.div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
          initial={{ scale: 1.1 }}
          animate={{
            scale: index === currentImage ? 1 : 1.1,
          }}
          transition={{
            duration: 6,
            ease: "linear",
          }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            layout="fill"
            objectFit="cover"
            className="w-full h-full object-center brightness-75"
          />
        </motion.div>
      ))}

      {/* Content Container */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-8">
          {/* Animated Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-textGradient"
          >
            Find Your Emotions!
          </motion.h1>

          {/* Animated Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-white"
          >
            Explore Georgia NOW!
          </motion.p>

          {/* Animated Search Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-md mx-auto"
          >
            {/* Animated Select */}
            <motion.select
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="w-full md:w-64 px-4 py-2 rounded-lg bg-white/90 backdrop-blur-sm 
                         text-gray-800 border-2 border-transparent focus:border-blue-500 
                         focus:outline-none transition-colors duration-200"
            >
              <option value="">Select Destination</option>
              {destinations.map((dest) => (
                <option key={dest.value} value={dest.value}>
                  {dest.label}
                </option>
              ))}
            </motion.select>

            {/* Animated Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button
                className="w-full md:w-auto px-8 py-2 font-semibold rounded-lg 
                               transition-all duration-200 hover:scale-105"
              >
                Find Now
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CoverSection;
