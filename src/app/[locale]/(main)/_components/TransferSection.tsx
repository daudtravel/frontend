import { Car, Clock, Shield, MapPin } from "lucide-react";
import { Button } from "@/src/components/ui/button";

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

  return (
    <section className="relative overflow-hidden bg-[#f2f5ff]">
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-5 md:mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-black mb-6">
            Our Transfer Services
          </h2>
          <div className="w-24 h-1 bg-[#5E7CFF] mx-auto"></div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
          {transferFeatures.map((feature, index) => (
            <div
              key={index}
              className="text-center p-3 md:p-6 rounded-lg bg-white shadow-md transform transition-transform duration-300 hover:scale-105"
            >
              <div className="flex justify-center">{feature.icon}</div>
              <h3 className="text-base font-semibold text-black mb-3">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center text-xl mt-6 md:mt-12">
          <Button className="text-xl">Book Your Transfer</Button>
        </div>
      </div>
    </section>
  );
};

export default TransferSection;
