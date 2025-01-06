"use client";

import Image from "next/image";
import Img from "@img/images/Family.jpg";
import { withAuth } from "@/src/auth/isAuth";

function Page() {
  return (
    <div className="w-full pb-8 md:px-20 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div className="relative aspect-square sm:w-full border-2 border-[#f2f5ff] lg:rounded-lg overflow-hidden shadow-xl">
              <Image
                src={Img}
                alt="Our Travel Company"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="relative hidden lg:flex sm:right-10 sm:top-20 sm:z-10 border-2 border-[#f2f5ff] aspect-square sm:w-full rounded-lg overflow-hidden shadow-xl">
              <Image
                src={Img}
                alt="Our Travel Company"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="relative border-2 hidden lg:flex border-[#f2f5ff] aspect-video rounded-lg overflow-hidden shadow-xl sm:col-span-2">
              <Image
                src={Img}
                alt="Our Travel Company"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>

        {/* Company Description Section */}
        <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-center bg-clip-text text-transparent bg-mainGradient">
            About us
          </h1>

          <div className="space-y-4 text-gray-700 mt-8 lg:mt-20">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm sm:text-base">
                To inspire travelers to explore the world, connect with diverse
                cultures, and create lasting memories. To inspire travelers to
                explore the world, connect with diverse cultures, and create
                lasting memories. To inspire travelers to explore the world,
                connect with diverse cultures, and create lasting memories. To
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm sm:text-base">
                To inspire travelers to explore the world, connect with diverse
                cultures, and create lasting memories. To inspire travelers to
                explore the world, connect with diverse cultures, and create
                lasting memories. To inspire travelers to explore the world,
                connect with diverse cultures, and create lasting memories.
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm sm:text-base">
                To inspire travelers to explore the world, connect with diverse
                cultures, and create lasting memories. To inspire travelers to
                explore the world, connect with diverse cultures, and create
                lasting memories. To inspire travelers to explore the world,
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
