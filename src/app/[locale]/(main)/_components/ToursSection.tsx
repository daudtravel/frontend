import React from "react";
import Batumi from "@img/images/Batumi.jpg";
import Svaneti from "@img/images/Svaneti.jpg";
import Image from "next/image";

export default function ToursSection() {
  const tours = [
    {
      id: 1,
      name: "Batumi",
      alt: "Paris cityscape",
      img: Batumi,
    },
    {
      id: 2,
      name: "Svaneti",
      alt: "Paris cityscape",
      img: Svaneti,
    },
    {
      id: 3,
      name: "Svaneti",
      alt: "Paris cityscape",
      img: Svaneti,
    },
    {
      id: 4,
      name: "Batumi",
      alt: "Paris cityscape",
      img: Batumi,
    },
    {
      id: 5,
      name: "Svaneti",
      alt: "Paris cityscape",
      img: Svaneti,
    },
    {
      id: 6,
      name: "Batumi",
      alt: "Paris cityscape",
      img: Batumi,
    },
    // ... other tour objects
  ];

  return (
    <section className="container mx-auto px-4 pt-12 pb-24 md:px-20 z-[10000000000]">
      <h1 className="text-4xl text-center tracking-widest mb-12 uppercase text-slate-700">
        Popular Destinations
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tours.map((tour) => (
          <div key={tour.id} className="md:col-span-1 cursor-pointer">
            <div className="relative group overflow-hidden rounded-lg">
              <Image
                src={tour.img}
                alt={tour.alt}
                className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-75"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end justify-between">
                <h3 className="text-white text-xl font-semibold p-4">
                  {tour.name}
                </h3>
                <div className="text-white text-sm font-medium p-4 hover:underline">
                  View More
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
