"use client";

import { useState, useEffect } from "react";
import { WorldMap } from "@/src/components/svg";

import { Clock, MapPin, MapPinCheck, User } from "lucide-react";
import { motion } from "framer-motion";

export default function WhyUsSection() {
  const [stats, setStats] = useState({
    clients: 0,
    tours: 0,
    destinations: 0,
    years: 0,
  });

  useEffect(() => {
    const incrementStats = () => {
      setStats((prevStats) => ({
        clients: Math.min(prevStats.clients + 10, 1000),
        tours: Math.min(prevStats.tours + 2, 200),
        destinations: Math.min(prevStats.destinations + 1, 10),
        years: Math.min(prevStats.years + 1, 5),
      }));
    };

    const interval = setInterval(incrementStats, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white pt-10 pb-20 px-4 md:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 md:gap-8 lg:gap-10">
        <div className="flex flex-col justify-center gap-6 lg:gap-8 lg:w-[470px]">
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center md:text-start font-bold leading-tight"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            Why Choose Us
          </motion.h1>
          <motion.p
            className="text-slate-700 text-lg text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
          >
            Your trusted partner in exploring Georgia's finest destinations
          </motion.p>
        </div>

        <div className="relative flex-1">
          <motion.div
            className="h-full md:h-[250px] lg:h-[300px] absolute w-full -top-20 md:-top-0 object-cover"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <WorldMap />
          </motion.div>

          <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-md mx-auto relative md:pt-16 pt-10">
            <motion.div
              className="bg-white p-3 md:p-4 shadow-lg rounded-lg flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <User className="h-6 w-6 md:h-8 md:w-8 text-primary-500" />
              <div className="text-xl md:text-2xl lg:text-3xl font-bold">
                {stats.clients.toLocaleString()}+
              </div>
              <div className="text-slate-600 text-sm md:text-base">
                Happy Clients
              </div>
            </motion.div>

            <motion.div
              className="bg-white p-3 md:p-4 shadow-lg rounded-lg flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <MapPinCheck className="h-6 w-6 md:h-8 md:w-8 text-primary-500" />
              <div className="text-xl md:text-2xl lg:text-3xl font-bold">
                {stats.tours}+
              </div>
              <div className="text-slate-600 text-sm md:text-base">
                Tours Completed
              </div>
            </motion.div>

            <motion.div
              className="bg-white p-3 md:p-4 shadow-lg rounded-lg flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <MapPin className="h-6 w-6 md:h-8 md:w-8 text-primary-500" />
              <div className="text-xl md:text-2xl lg:text-3xl font-bold">
                {stats.destinations}+
              </div>
              <div className="text-slate-600 text-sm md:text-base">
                Destinations
              </div>
            </motion.div>

            <motion.div
              className="bg-white p-3 md:p-4 shadow-lg rounded-lg flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <Clock className="h-6 w-6 md:h-8 md:w-8 text-primary-500" />
              <div className="text-xl md:text-2xl lg:text-3xl font-bold">
                {stats.years}+
              </div>
              <div className="text-slate-600 text-sm md:text-base">
                Years Experience
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
