"use client";

import { Button } from "@/src/components/ui/button";
import { MapPin, Clock, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/src/components/ui/tabs";
import Batumi from "@img/images/Batumi.jpg";
import Image from "next/image";

const TourDetailsPage = () => {
  const mockTourData = {
    id: 1,
    title: "Batumi Coastline",
    description:
      "Experience the magic of Georgia's premier coastal city. Walk along the beautiful boulevard, visit the alphabet tower, and enjoy modern architecture blended with historical charm. This tour includes visits to the botanical garden, European square, and Piazza.",
    mainImage: Batumi,
    location: "Batumi, Georgia",
    price: 299,
    duration: "2 days",
    startDates: ["Every Saturday", "Every Wednesday"],
    highlights: [
      "Batumi Boulevard walk",
      "Botanical Garden visit",
      "Cable car ride",
      "Traditional Adjarian cuisine",
      "Evening light show at dancing fountains",
    ],
    gallery: [Batumi, Batumi, Batumi, Batumi, Batumi],
  };

  return (
    <div className="w-full min-h-screen  ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Hero Section - Adjusted height for different screens */}
        <div className="relative h-64 sm:h-80 lg:h-96 mb-4 sm:mb-6 lg:mb-8 rounded-xl overflow-hidden">
          <Image
            src={mockTourData.mainImage}
            alt={mockTourData.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              {mockTourData.title}
            </h1>
            <div className="flex items-center text-white gap-2">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">
                {mockTourData.location}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content - Responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 ">
          {/* Left Column - Tour Details */}
          <div className="lg:col-span-2 ">
            {/* Booking Card for Mobile - Shows at top on mobile only */}
            <div className="lg:hidden mb-4 bg-[#f2f5ff]  cv">
              <Card >
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold">
                          ${mockTourData.price}
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm">per person</span>
                    </div>
                    <Button className="w-full">Book Now</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="overview" className="flex-1 sm:flex-none">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="gallery" className="flex-1 sm:flex-none">
                  Gallery
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                      Tour Overview
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base mb-6">
                      {mockTourData.description}
                    </p>

                    <h3 className="text-lg sm:text-xl font-semibold mb-4">
                      Tour Highlights
                    </h3>
                    <ul className="space-y-2">
                      {mockTourData.highlights.map((highlight, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm sm:text-base"
                        >
                          <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {mockTourData.gallery.map((image, index) => (
                        <div
                          key={index}
                          className="aspect-video relative rounded-lg overflow-hidden"
                        >
                          <Image
                            fill
                            src={image}
                            alt={`Tour gallery ${index + 1}`}
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking Card (Hidden on mobile) */}
          <div className="hidden lg:block">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-2xl font-bold">
                        ${mockTourData.price}
                      </span>
                    </div>
                    <span className="text-gray-500">per person</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span>Duration: {mockTourData.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">Start Dates:</p>
                        {mockTourData.startDates.map((date, index) => (
                          <p key={index} className="text-sm text-gray-600">
                            {date}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">Book Now</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailsPage;
