"use client";

import { Car, Clock, Shield, MapPin } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { motion } from "framer-motion";

const TransferSection = () => {
  const transferFeatures = [
    {
      icon: <Car className="w-8 h-8 text-[orange] mb-4" />,
      title: "Modern Vehicle",
    },
    {
      icon: <Clock className="w-8 h-8 text-[orange] mb-4" />,
      title: "24/7 Availability",
    },
    {
      icon: <Shield className="w-8 h-8 text-[orange] mb-4" />,
      title: "Licensed Drivers",
    },
    {
      icon: <MapPin className="w-8 h-8 text-[orange] mb-4" />,
      title: "Door-to-Door Service",
    },
  ];

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  // Animation variants for features
  const featureVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.6,
      },
    },
  };

  // Animation variants for the header
  const headerVariants = {
    hidden: {
      opacity: 0,
      y: -50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  // Animation variants for the divider line
  const lineVariants = {
    hidden: {
      width: 0,
      opacity: 0,
    },
    visible: {
      width: "96px",
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.4,
      },
    },
  };

  // Animation variants for the CTA button
  const buttonVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
        delay: 0.8,
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
    <section className="relative overflow-hidden bg-[#f2f5ff]">
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-5 md:mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headerVariants}
        >
          <h2 className="text-2xl md:text-4xl font-bold text-black mb-6">
            Our Transfer Services
          </h2>
          <motion.div
            className="h-1 bg-[#5E7CFF] mx-auto"
            variants={lineVariants}
          />
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {transferFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-3 md:p-6 rounded-lg bg-white shadow-md"
              variants={featureVariants}
              whileHover={{
                y: -5,
                scale: 1.02,
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                },
              }}
            >
              <motion.div
                className="flex justify-center"
                whileHover={{
                  rotate: [0, -10, 10, -10, 0],
                  transition: { duration: 0.5 },
                }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-base font-semibold text-black mb-3">
                {feature.title}
              </h3>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="text-center text-xl mt-6 md:mt-12"
          variants={buttonVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            <Button className="text-xl px-8 py-6">Book Your Transfer</Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TransferSection;
