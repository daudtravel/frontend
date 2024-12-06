"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion } from "framer-motion";
import { Car, MapPin, Clock, User, Star } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import img from "@img/images/Family.jpg";
import Image from "next/image";

const drivers = [
  {
    name: "Michael Rodriguez",
    experience: "8 years",
    rating: 4.9,
    image: img,
  },
  {
    name: "Sarah Thompson",
    experience: "6 years",
    rating: 4.8,
    image: img,
  },
  {
    name: "Alex Chen",
    experience: "5 years",
    rating: 4.7,
    image: img,
  },
  {
    name: "Emma Williams",
    experience: "7 years",
    rating: 4.9,
    image: img,
  },
];

const locations = [
  {
    destination: "Airport Transfer",
    price: "$45",
    duration: "45-60 mins",
    description: "Transfer to and from the airport in comfort and style.",
    imageUrl: img,
  },
  {
    destination: "City Tour",
    price: "$65",
    duration: "2-3 hours",
    description: "Explore the city's attractions with our guided tours.",
    imageUrl: img,
  },
  {
    destination: "Business Transfer",
    price: "$55",
    duration: "1-1.5 hours",
    description: "Efficient and professional business transfer services.",
    imageUrl: img,
  },
  {
    destination: "Suburban Shuttle",
    price: "$35",
    duration: "30-45 mins",
    description: "Convenient shuttle service to suburban areas.",
    imageUrl: img,
  },
];

const TransferServicesPage = () => {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { type: "spring", stiffness: 300 },
    },
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <motion.div
        className="container mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        {/* Locations Section */}
        <motion.div className="text-center mb-12" variants={pageVariants}>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Transfer Services
          </h1>
          <p className="text-xl text-gray-600">
            Reliable, Comfortable, and Efficient Transportation
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={pageVariants}
        >
          {locations.map((location, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 text-center cursor-pointer"
              variants={cardVariants}
              whileHover="hover"
              onClick={() => setSelectedLocation(location)}
            >
              <MapPin className="w-12 h-12 mx-auto text-[#5E7CFF] mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {location.destination}
              </h3>
              <div className="flex justify-center items-center space-x-4 mb-3">
                <div className="flex items-center">
                  <Car className="mr-2 text-[#5E7CFF]" size={20} />
                  <span>{location.price}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 text-[#5E7CFF]" size={20} />
                  <span>{location.duration}</span>
                </div>
              </div>
              <p className="text-gray-600">{location.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Drivers Section */}
        <motion.div className="mt-16" variants={pageVariants}>
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Professional Drivers
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {drivers.map((driver, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 text-center cursor-pointer"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={driver.image}
                    alt={driver.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{driver.name}</h3>
                <div className="flex justify-center items-center space-x-4 text-gray-600">
                  <div className="flex items-center">
                    <User className="mr-2 text-[#5E7CFF]" size={20} />
                    <span>{driver.experience}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="mr-2 text-yellow-500" size={20} />
                    <span>{driver.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Modal for Location Details (Optional) */}
        {selectedLocation && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedLocation(null)}
          >
            <motion.div
              className="bg-white rounded-lg p-8 max-w-md text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedLocation.imageUrl}
                alt={selectedLocation.destination}
                className="w-full h-64 object-cover mb-4 rounded"
              />
              <h3 className="text-2xl font-bold mb-4">
                {selectedLocation.destination}
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedLocation.description}
              </p>
              <div className="flex justify-center space-x-6">
                <div className="flex items-center">
                  <Car className="mr-2 text-[#5E7CFF]" size={24} />
                  <span className="font-semibold">
                    {selectedLocation.price}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 text-[#5E7CFF]" size={24} />
                  <span className="font-semibold">
                    {selectedLocation.duration}
                  </span>
                </div>
              </div>
              <Button className="mt-6">Book Now</Button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TransferServicesPage;
