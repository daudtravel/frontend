"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Svaneti from "@images/Svaneti.jpg";
import Batumi from "@images/Batumi.jpg";

const CoverSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedDestination, setSelectedDestination] = useState("");

  const destinations = [
    { value: "svaneti", label: "Svaneti" },
    { value: "batumi", label: "Batumi" },
    { value: "tbilisi", label: "Tbilisi" },
    { value: "kazbegi", label: "Kazbegi" },
  ];

  const images = [
    { src: Svaneti, alt: "Svaneti" },
    { src: Batumi, alt: "Batumi" },
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === 0 ? 1 : 0));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen md:h-[800px] overflow-hidden">
      {/* Background Images */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-[0ms] ease-linear
            ${currentImage === index ? "opacity-100 z-10" : "opacity-0 z-0"}
          `}
        >
          <div className="w-full h-full relative overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt}
              objectFit="cover"
              className={`transform transition-transform duration-[8000ms] ease-linear object-cover w-full h-full object-center
                ${currentImage === index ? "scale-110" : "scale-100"}
              `}
            />
          </div>
        </div>
      ))}
      <div className="absolute inset-0 bg-black/40 z-20" />
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-8">
          {/* Main Text */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              Find Your Emotions!
            </h1>
            <p className="text-xl md:text-2xl text-white">
              Explore Georgia NOW!
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full md:w-64 px-4 py-2 rounded-lg bg-white text-gray-800 border-2 border-transparent focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select Destination</option>
              {destinations.map((dest) => (
                <option key={dest.value} value={dest.value}>
                  {dest.label}
                </option>
              ))}
            </select>
            <button className="w-full md:w-auto px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200">
              Find Now
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default CoverSection;
