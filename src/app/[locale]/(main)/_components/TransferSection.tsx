import { Car, Clock, Shield, MapPin, Navigation } from "lucide-react";
import Road from "@img/images/Road.webp";

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

  const routes = [
    {
      from: "Batumi",
      to: "Tbilisi",
      duration: "6 hours",
      distance: "378 km",
      highlights: "Scenic mountain views",
    },
    {
      from: "Batumi",
      to: "Kazbegi",
      duration: "8 hours",
      distance: "445 km",
      highlights: "Mountain passes & valleys",
    },
    {
      from: "Batumi",
      to: "Kutaisi",
      duration: "2.5 hours",
      distance: "155 km",
      highlights: "Cultural landmarks",
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

          {/* Popular Routes */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold text-white mb-8">
              Popular Routes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {routes.map((route, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg backdrop-blur-sm bg-white/10 transform transition-transform duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-center mb-4">
                    <Navigation className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-4">
                    {route.from} - {route.to}
                  </h4>
                  <div className="space-y-2 text-gray-200">
                    <p>Duration: {route.duration}</p>
                    <p>Distance: {route.distance}</p>
                    <p className="text-sm italic">{route.highlights}</p>
                  </div>
                </div>
              ))}
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
