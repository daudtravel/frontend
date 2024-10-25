"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import imgDesktop from "@images/GG.png";
import imgMobile from "@images/GG.png";

// Custom useMediaQuery hook
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addListener(listener);

    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};

// Static apartments data
const apartmentsData = {
  apt1: {
    id: "apt1",
    number: "101",
    status: "Reserved",
  },
  apt2: {
    id: "apt2",
    number: "102",
    status: "Sold",
  },
  apt3: {
    id: "apt3",
    number: "103",
    status: "Reserved",
  },
};

const areas = [
  {
    id: 1,
    desktopCoords: "158,828,158,750,220,753,225,624,354,627,354,831",
    desktopPoints: "158,828 158,750 220,753 225,624 354,627 354,831",
    mobileCoords: "79,414,79,375,110,376,112,312,177,313,177,415",
    mobilePoints: "79,414 79,375 110,376 112,312 177,313 177,415",
    apartmentId: "apt1",
  },
  {
    id: 2,
    desktopCoords:
      "6,673,0,828,156,826,153,748,223,750,223,624,182,624,182,675",
    desktopPoints:
      "6,673 0,828 156,826 153,748 223,750 223,624 182,624 182,675",
    mobileCoords: "3,336,0,414,78,413,76,374,111,375,111,312,91,312,91,337",
    mobilePoints: "3,336 0,414 78,413 76,374 111,375 111,312 91,312 91,337",
    apartmentId: "apt2",
  },
  {
    id: 3,
    desktopCoords: "359,828,354,624,488,624,488,831",
    desktopPoints: "359,828 354,624 488,624 488,831",
    mobileCoords: "179,414,177,312,244,312,244,415",
    mobilePoints: "179,414 177,312 244,312 244,415",
    apartmentId: "apt3",
  },
];

export default function Test() {
  const [hoveredArea, setHoveredArea] = useState(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const overlayStyles = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "sold":
        return "text-red-500";
      case "reserved":
        return "text-yellow-600";
      default:
        return "text-green-500";
    }
  };

  const renderApartmentLabel = (area) => {
    const apartment = apartmentsData[area.apartmentId];
    if (!apartment) return null;

    const points = (isDesktop ? area.desktopPoints : area.mobilePoints).split(
      " "
    );
    const xPoints = points.map((p) => parseInt(p.split(",")[0]));
    const yPoints = points.map((p) => parseInt(p.split(",")[1]));

    const centerX = (Math.min(...xPoints) + Math.max(...xPoints)) / 2;
    const centerY = (Math.min(...yPoints) + Math.max(...yPoints)) / 2;

    return (
      <div
        key={area.id}
        className={`
          absolute transform -translate-x-1/2 -translate-y-1/2 
          bg-white/90 p-2 rounded-md shadow-md 
          ${isDesktop ? "text-sm" : "text-xs"}
        `}
        style={{
          left: `${centerX}px`,
          top: `${centerY}px`,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <p className="font-bold">#{apartment.number}</p>
        <p className={`font-medium ${getStatusColor(apartment.status)}`}>
          {apartment.status}
        </p>
      </div>
    );
  };

  return (
    <div className="flex justify-center w-full">
      <div className="relative w-full max-w-[1447px] h-auto my-40 mx-10">
        <Image
          src={isDesktop ? imgDesktop : imgMobile}
          alt="Interactive map"
          className="w-full h-auto"
          useMap="#image-map"
          width={isDesktop ? 1447 : 723}
          height={isDesktop ? 834 : 417}
          priority
        />

        <map name="image-map">
          {areas.map((area) => (
            <area
              key={area.id}
              target="_self"
              alt={`Apartment ${apartmentsData[area.apartmentId]?.number}`}
              title={`Apartment ${apartmentsData[area.apartmentId]?.number}`}
              coords={isDesktop ? area.desktopCoords : area.mobileCoords}
              shape="poly"
              onMouseEnter={() => setHoveredArea(area.id)}
              onMouseLeave={() => setHoveredArea(null)}
            />
          ))}
        </map>

        <svg
          style={overlayStyles}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        >
          {areas.map((area) => (
            <polygon
              key={area.id}
              points={isDesktop ? area.desktopPoints : area.mobilePoints}
              fill={
                hoveredArea === area.id
                  ? "rgba(173, 216, 230, 0.5)"
                  : "transparent"
              }
              stroke={
                hoveredArea === area.id
                  ? "rgba(173, 216, 230, 0.7)"
                  : "transparent"
              }
              strokeWidth={isDesktop ? "2" : "1"}
            />
          ))}
        </svg>

        {areas.map((area) => renderApartmentLabel(area))}
      </div>
    </div>
  );
}
