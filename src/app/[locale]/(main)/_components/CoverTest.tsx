import { Case, Ellipse, WorldMap } from "@/src/components/svg"; // Make sure the path is correct
import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import img1 from "@img/images/Svaneti.jpg";

export default function CoverTest() {
  return (
    <div className="relative w-full h-auto overflow-hidden bg-white flex flex-row lg:pl-24 xl:pl-44 pt-20 gap-10">
      <Ellipse className="absolute inset-0 h-full w-full object-cover left-0" />

      <div className="relative z-10 flex h-full justify-center flex-col w-[470px] gap-8 pt-32 ">
        <Button className="bg-white w-52 rounded-xl text-main">
          Explore Georgia now <Case className="w-6 h-6" />
        </Button>
        <h1 className="lg:text-4xl xl:text-6xl font-bold  leading-loose">
          Travel to the top destination of Georgia
        </h1>
        <p className="text-slate-700">
          We always make our customers happy by providing as many choices as
          possible
        </p>
      </div>

      <div className="relative z-10 w-full h-full flex justify-center items-center pt-28">
        <WorldMap className="h-[300px] absolute w-full top-0 object-cover" />
        <div className="flex flex-col items-center z-10 pr-10">
          <div className="flex flex-row gap-8 w-full h-full items-center">
            <div className="flex flex-col gap-5">
              <Image
                src={img1}
                alt="Image 1"
                className="xl:w-[270px] lg:w-[220px] lg:h-[240px]  xl:h-[300px] object-cover rounded-2xl"
              />
              <Image
                src={img1}
                alt="Image 2"
                className="xl:w-[270px] lg:w-[220px] lg:h-[240px]  xl:h-[300px] object-cover rounded-2xl"
              />
            </div>
            <div>
              <Image
                src={img1}
                alt="Image 3"
                className="lg:w-[220px] lg:h-[310px] xl:w-[280px] xl:h-[400px] object-cover rounded-2xl"
              />
            </div>
          </div>
          {/* WorldMap component below the images */}
        </div>
      </div>
    </div>
  );
}
