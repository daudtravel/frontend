import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import test from "@img/images/About2.jpg";

import { Button } from "@/src/components/ui/button";
import Image from "next/image";

const TransportPage = () => {
  const drivers = [
    {
      name: "John Smith",
      image: test,
    },
    {
      name: "Sarah Wilson",
      image: test,
    },
    {
      name: "Michael Chen",
      image: test,
    },
  ];

  const destinations = [
    { id: 1, location: "Airport Transfer", price: 45 },
    { id: 2, location: "City Center", price: 30 },
    { id: 3, location: "Shopping Mall", price: 35 },
    { id: 4, location: "Beach Resort", price: 55 },
    { id: 5, location: "Business District", price: 40 },
    { id: 6, location: "Sports Complex", price: 45 },
  ];

  return (
    <div className="container mx-auto  md:px-20 px-4 bg-white flex flex-col gap-10 py-20">
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">
          Our Destinations & Prices
        </h2>
        <Card>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <span className="font-medium">{dest.location}</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold">${dest.price}</span>
                  <Button size="sm">Book</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">
          Our Professional Drivers !
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {drivers.map((driver, index) => (
            <Card
              key={index}
              className="overflow-hidden bg-[#f2f5ff] shadow-xl"
            >
              <CardHeader className="text-center pb-4">
                <Image
                  src={driver.image}
                  alt={driver.name}
                  className="rounded-full w-56 h-56 mx-auto mb-4 object-cover"
                />
                <CardTitle className="text-2xl">{driver.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TransportPage;
