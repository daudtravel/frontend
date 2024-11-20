import { Button } from "@/src/components/ui/button";
import img from "@img/images/Batumi.jpg";
import { MapPin } from "lucide-react";
import Image from "next/image";

export default function Page() {
  const items = [
    {
      id: 1,
      title: "Item 1",
      content: "Content 1",
      imageUrl: img,
    },
    {
      id: 2,
      title: "Item 2",
      content: "Content 2",
      imageUrl: img,
    },
    {
      id: 3,
      title: "Item 3",
      content: "Content 3",
      imageUrl: img,
    },
    {
      id: 4,
      title: "Item 4",
      content: "Content 4",
      imageUrl: img,
    },
    {
      id: 5,
      title: "Item 5",
      content: "Content 5",
      imageUrl: img,
    },
  ];

  return (
    <main className="w-full min-h-screen py-20">
      <p className="text-xl md:text-4xl text-center text-black">
        Choose your destination
      </p>
      <div className="bg-backgroundTest bg-cover w-full h-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-10 md:px-40 bg-white/60  py-20 ">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative h-96 w-full overflow-hidden group  hover:scale-105 rounded-md shadow-xl"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-black/30" />

              <div className="absolute inset-0 flex flex-row items-end  justify-between text-white p-6 space-y-4">
                <h2 className="text-xl font-bold text-center flex flex-row items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {item.title}
                </h2>
                <Button className="h-8">Find More</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
