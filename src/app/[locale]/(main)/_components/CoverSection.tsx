"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";

const CoverSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const images = [
    { src: "/images/Svaneti.jpg", alt: "Svaneti" },
    { src: "/images/Batumi.jpg", alt: "Batumi" },
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="relative w-full h-screen md:h-[800px] overflow-hidden bg-white">
      {isClient ? (
        <AnimatePresence mode="wait">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className={`absolute inset-0 w-full h-full ${
                index === currentImage ? "z-10" : "z-0"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                layout="fill"
                objectFit="cover"
                className="object-cover w-full h-full object-center brightness-75 filter"
              />
            </motion.div>
          ))}

          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 ">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
                delay: 0.2,
              }}
              className="text-center space-y-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-text-gradient">
                Find Your Emotions!
              </h1>
              <p className="text-xl md:text-2xl text-white">
                Explore Georgia NOW!
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <motion.select
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                    delay: 0.6,
                  }}
                  className="w-full md:w-64 px-4 py-2 rounded-lg bg-white text-gray-800 border-2 border-transparent focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select Destination</option>
                  {destinations.map((dest) => (
                    <option key={dest.value} value={dest.value}>
                      {dest.label}
                    </option>
                  ))}
                </motion.select>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                    delay: 0.8,
                  }}
                >
                  <Button className="w-full md:w-auto px-8 py-2 font-semibold rounded-lg transition-colors duration-200">
                    Find Now
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      ) : (
        <div className="h-screen flex items-center justify-center w-full bg-white">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default CoverSection;
