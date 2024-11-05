import { Car, Clock, Shield, MapPin } from "lucide-react";
import Road from "@img/images/Road.webp";
import { Button } from "@/src/components/ui/button";

const TransferSection = () => {
  const transferFeatures = [
    {
      icon: <Car className="w-10 h-10 text-white mb-4" />,
      title: "Modern Vehicle",
    },
    {
      icon: <Clock className="w-10 h-10 text-white mb-4" />,
      title: "24/7 Availability",
    },
    {
      icon: <Shield className="w-10 h-10 text-white mb-4" />,
      title: "Licensed Drivers",
    },
    {
      icon: <MapPin className="w-10 h-10 text-white mb-4" />,
      title: "Door-to-Door Service",
      description:
        "Convenient pickup and drop-off at your preferred locations across the region",
    },
  ];

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat "
      style={{
        backgroundImage: `url(${Road.src})`,
        backgroundColor: "#9a9949",
      }}
    >
      <div className="relative min-h-auto bg-black/50">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Transfer Services
            </h2>
            <div className="w-24 h-1 bg-white mx-auto"></div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {transferFeatures.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg backdrop-blur-sm   bg-[#DFE6FC]/10 
                transform transition-transform duration-300 hover:scale-105"
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center text-xl  mt-12">
            <Button className="text-xl">Book Your Transfer</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransferSection;
