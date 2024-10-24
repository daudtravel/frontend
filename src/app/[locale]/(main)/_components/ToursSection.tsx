import React from "react";
import img from "@images/Batumi.jpg";
import Image from "next/image";

export default function ToursSection() {
  const tours = [
    {
      id: 1,
      name: "Paris",
      alt: "Paris cityscape",
    },
    {
      id: 2,
      name: "Rome",
      alt: "Rome attractions",
    },
    {
      id: 3,
      name: "Barcelona",
      alt: "Barcelona views",
    },
    {
      id: 4,
      name: "London",
      alt: "London landmarks",
    },
    {
      id: 5,
      name: "Amsterdam",
      alt: "Amsterdam canals",
    },
    {
      id: 6,
      name: "Prague",
      alt: "Prague architecture",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-12 md:px-20 z-[10000000000]">
      <h2 className="text-3xl font-bold text-center mb-12">
        Popular Destinations
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* First Row */}
        <div className="md:col-span-1">
          <div className="relative group overflow-hidden rounded-lg">
            <Image
              src={img}
              alt={tours[0].alt}
              className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <h3 className="text-white text-xl font-semibold p-4">
                {tours[0].name}
              </h3>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="relative group overflow-hidden rounded-lg">
            <Image
              src={img}
              alt={tours[1].alt}
              className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <h3 className="text-white text-xl font-semibold p-4">
                {tours[1].name}
              </h3>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="relative group overflow-hidden rounded-lg">
            <Image
              src={img}
              alt={tours[2].alt}
              className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <h3 className="text-white text-xl font-semibold p-4">
                {tours[2].name}
              </h3>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="md:col-span-1">
          <div className="relative group overflow-hidden rounded-lg">
            <Image
              src={img}
              alt={tours[3].alt}
              className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <h3 className="text-white text-xl font-semibold p-4">
                {tours[3].name}
              </h3>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="relative group overflow-hidden rounded-lg">
            <Image
              src={img}
              alt={tours[4].alt}
              className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <h3 className="text-white text-xl font-semibold p-4">
                {tours[4].name}
              </h3>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="relative group overflow-hidden rounded-lg">
            <Image
              src={img}
              alt={tours[5].alt}
              className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <h3 className="text-white text-xl font-semibold p-4">
                {tours[5].name}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
