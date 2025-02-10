import React from 'react';
import Image from "next/image";
import img from "@img/images/About1.jpg";

const OwnerSection = () => {
  return (
    <div className="mt-16 w-full lg:px-20">
      <div className="flex flex-col lg:flex-row items-start gap-8 px-4 md:px-0">
        <div className="w-full lg:w-1/3">
          <div className="relative h-[400px] w-full border-2 border-[#f2f5ff] rounded-lg overflow-hidden shadow-xl">
            <Image
              src={img}
              alt="Company Owner"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
        
        <div className="w-full lg:w-2/3 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center lg:text-left bg-clip-text text-transparent bg-mainGradient">
            Meet Our Founder
          </h2>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Background & Education</h3>
              <p className="text-sm sm:text-base text-gray-700">
                [Owner Name] graduated from [University] with a degree in Tourism Management. 
                Their passion for travel began during their study abroad experience in [Country], 
                which inspired them to create Daud Travel.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Languages & Expertise</h3>
              <p className="text-sm sm:text-base text-gray-700">
                Fluent in Arabic, English, and Turkish, [Owner Name] has personally visited over 
                30 countries across 5 continents. Their expertise in cultural tourism and luxury 
                travel planning has made Daud Travel a trusted name in the industry.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Vision & Values</h3>
              <p className="text-sm sm:text-base text-gray-700">
                With over [X] years of experience in the travel industry, [Owner Name] has built 
                Daud Travel on the principles of personalized service, cultural authenticity, and 
                unforgettable experiences. Their commitment to sustainable tourism and local 
                community support sets our company apart.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerSection;