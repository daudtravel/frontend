import React from "react";
import Image from "next/image";
import { Users, Shield, Map, Star } from "lucide-react";
import img from "@images/Sunset2.jpg";

export default function WhyUsSection() {
  const features = [
    {
      icon: <Shield className="w-12 h-12 text-white mb-4" />,
      title: "100% Safe Travel",
      description:
        "Your safety is our top priority with verified accommodations and trusted transport partners",
    },
    {
      icon: <Users className="w-12 h-12 text-white mb-4" />,
      title: "Trusted by Thousands",
      description:
        "Join our community of happy travelers who keep coming back for more adventures",
    },
    {
      icon: <Map className="w-12 h-12 text-white mb-4" />,
      title: "100+ Tours Available",
      description:
        "Explore our diverse range of carefully crafted tours across stunning destinations",
    },
    {
      icon: <Star className="w-12 h-12 text-white mb-4" />,
      title: "5-Star Experience",
      description:
        "Consistently rated 5 stars by our satisfied customers for exceptional service",
    },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background Image Container */}

      <div className="absolute inset-0 h-[1200px] md:h-full">
        <div className="relative h-full">
          <Image
            src={img}
            alt="Background"
            className="object-cover sticky top-0 w-full h-[1200px] "
            quality={100}
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative ">
        <div className="container mx-auto px-4 py-24">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose Us?
            </h2>
            <div className="w-24 h-1 bg-white mx-auto"></div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg backdrop-blur-sm bg-white/10 
                transform transition-transform duration-300 hover:scale-105"
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
