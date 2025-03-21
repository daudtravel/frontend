"use client";

import { CardContent } from "@/src/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { videoApi } from "@/src/routes/video";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

 
type Video = {
  id: string;
  youtube_link: string;
  title: string;
};

export default function VideoGallery() {
  const t = useTranslations("main");
  const params = useParams();
  const locale = params.locale as string;

  const { data: response, isLoading, error } = useQuery({
    queryKey: ["videos", locale],
    queryFn: () => videoApi.get(),
  });

 
  const videos: Video[] = response?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || videos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">
          {t("noVideosAvailable") || "No videos are currently available."}
        </p>
      </div>
    );
  }

  return (
    <section className="z-10 relative flex h-full w-full flex-col items-center pt-20 py-12 md:mt-12">
      <h1 className="absolute top-2 text-lg pt-4 text-center md:text-2xl tracking-widest font-semibold">
        {t("videoGallery")}
      </h1>
      <Carousel opts={{ loop: true }} className="mt-6 w-full">
        <CarouselContent className="w-full px-6 md:px-20">
          {videos.map((video) => (
            <CarouselItem
              key={video.id}
              className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 p-0"
            >
              <CardContent className="flex flex-col items-center justify-center px-4">
                <div className="w-full aspect-video rounded-lg shadow-lg overflow-hidden">
                  <ReactPlayer
                    url={video.youtube_link}
                    width="100%"
                    height="100%"
                    controls
                    light={true}
                    config={{
                      youtube: {
                        playerVars: { showinfo: 1 },
                      },
                    }}
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-center">{video.title}</p>
              </CardContent>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block md:absolute -top-20 md:right-20 lg:right-40">
          <CarouselPrevious className="bg-mainGradient text-white w-8 h-8 md:w-10 md:h-10 border-white rounded-md border hover:bg-mainGradientHover hover:text-white" />
          <CarouselNext className="bg-mainGradient text-white w-8 h-8 md:w-10 md:h-10 border-white rounded-md border hover:bg-mainGradientHover hover:text-white" />
        </div>
      </Carousel>
    </section>
  );
}
