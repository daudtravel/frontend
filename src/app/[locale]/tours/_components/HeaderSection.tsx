import Image from "next/image";
import Petra from "@img/images/123.jpg";

export default async function HeaderSection() {
  return (
    <section className="relative h-auto w-full">
      {/* Image */}
      <Image
        src={Petra}
        className="h-[460px] w-full z-10 relative brightness-75 object-top object-cover"
        alt="Destination Landscape"
      />
      <div className="absolute inset-0 z-30 left-20 top-20 px-4">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-textGradient">
            Find Your Emotions!
          </h1>
        </div>
      </div>
    </section>
  );
}
