import { Car, Clock, Shield, MapPin } from "lucide-react";
import Road from "@images/Road.webp";

const TransferSection = () => {
  const transferFeatures = [
    {
      icon: <Car className="w-12 h-12 text-white mb-4" />,
      title: "Modern Vehicle Fleet",
    },
    {
      icon: <Clock className="w-12 h-12 text-white mb-4" />,
      title: "24/7 Availability",
    },
    {
      icon: <Shield className="w-12 h-12 text-white mb-4" />,
      title: "Licensed Drivers",
    },
    {
      icon: <MapPin className="w-12 h-12 text-white mb-4" />,
      title: "Door-to-Door Service",
      description:
        "Convenient pickup and drop-off at your preferred locations across the region",
    },
  ];

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${Road.src})`,
        backgroundColor: "#9a9949",
      }}
    >
      <div className="relative min-h-screen bg-black/50">
        <div className="container mx-auto px-4 py-24">
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
                className="text-center p-6 rounded-lg backdrop-blur-sm bg-white/10 
                transform transition-transform duration-300 hover:scale-105"
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>

          {/* Vehicle Types */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold text-white mb-8">
              Available Vehicles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-6 rounded-lg backdrop-blur-sm bg-white/10">
                <h4 className="text-xl font-semibold text-white mb-2">Sedan</h4>
                <p className="text-gray-200">Up to 3 passengers</p>
              </div>
              <div className="p-6 rounded-lg backdrop-blur-sm bg-white/10">
                <h4 className="text-xl font-semibold text-white mb-2">SUV</h4>
                <p className="text-gray-200">Up to 5 passengers</p>
              </div>
              <div className="p-6 rounded-lg backdrop-blur-sm bg-white/10">
                <h4 className="text-xl font-semibold text-white mb-2">
                  Minivan
                </h4>
                <p className="text-gray-200">Up to 7 passengers</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-16">
            <button className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Book Your Transfer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransferSection;
