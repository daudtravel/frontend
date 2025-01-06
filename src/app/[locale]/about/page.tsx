import Image from "next/image";
import About1 from "@img/images/About1.jpg";
import About3 from "@img/images/About3.jpg";
import { Locale } from "@/src/i18n/routing";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("meta");
  return {
    title: t("about"),
    description: t("descriptionAbout"),
    openGraph: {
      title: t("about"),
      description: t("descriptionAbout"),
      type: "website",
      locale: locale,
      url: "https://www.daudtravel.com/about",
      siteName: "Daud Travel",
      images: [
        {
          url: "/images/AboutOG.png",
        },
      ],
    },
  };
}

function Page() {
  return (
    <div className="min-h-screen w-full pb-8 md:px-20 lg:py-12">
      <div className="flex flex-col w-full lg:flex-row gap-8 lg:items-start">
        <div className="w-full lg:w-2/3 xl:w-1/2 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 w-full">
            <div className="relative h-80 sm:h-[400px] w-full border-2 border-[#f2f5ff] lg:rounded-lg overflow-hidden md:shadow-xl">
              <Image
                src={About1}
                alt="Our Travel Company"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="relative hidden lg:flex sm:right-10 sm:top-20 sm:z-10 border-2 border-[#f2f5ff] h-96 sm:h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
              <Image
                src={About3}
                alt="Our Travel Company"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 lg:mt-0">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-center bg-clip-text text-transparent bg-mainGradient">
            About us
          </h1>

          <div className="space-y-4 w-full text-gray-700 mt-8 lg:mt-10">
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
