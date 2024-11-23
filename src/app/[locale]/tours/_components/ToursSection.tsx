"use client";
import { Button } from "@/src/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import Batumi from "@img/images/Batumi.jpg";
import Link from "next/link";

export default function ToursSection() {
  const items = [
    {
      id: 1,
      title: "Batumi Coastline",
      content: "Explore the stunning Black Sea coastline",
      imageUrl: Batumi,
      location: "Batumi, Georgia",
    },
    {
      id: 2,
      title: "Old Town Charm",
      imageUrl: Batumi,
      location: "Tbilisi, Georgia",
    },
    {
      id: 3,
      title: "Mountain Retreat",
      imageUrl: Batumi,
      location: "Kazbegi, Georgia",
    },
    {
      id: 4,
      title: "Wine Country",
      imageUrl: Batumi,
      location: "Kakheti, Georgia",
    },
    {
      id: 5,
      title: "Ancient Monasteries",
      imageUrl: Batumi,
      location: "Mtskheta, Georgia",
    },
  ];

  return (
    <section className="container md:px-20 px-4 pt-10 md:pt-20 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative h-96 w-full">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="absolute top-4 right-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center text-white">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{item.location}</span>
              </div>
            </div>

            <div className="absolute flex flex-row bottom-0 left-0 right-0 p-6 text-white">
              <Link className="w-full" href="/tours/1">
                <Button className="w-full bg-white/20 backdrop-blur-sm text-white group">
                  Explore Tour
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
