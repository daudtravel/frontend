import Image from "next/image";
import About1 from "@img/images/About1.jpg";
import About2 from "@img/images/About2.jpg";
import { Locale } from "@/src/i18n/routing";
import { getTranslations } from "next-intl/server";
import OwnerSection from "./_components/OwnerSection";
import { useTranslations, useLocale } from "next-intl";

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
    },
    icons: {
      icon: "/images/MainOG.png",
    },
  };
}

function Page() {
  const t = useTranslations("about");
  const currentLocale = useLocale();
  const isRTL = currentLocale === "ar";

  return (
    <div className="min-h-screen w-full pb-8 md:px-20 lg:py-12">
      <div
        className={`flex flex-col w-full lg:flex-row gap-4 lg:items-start ${isRTL ? "lg:flex-row-reverse" : ""}`}
      >
        <div
          className={`w-full lg:w-2/3 space-y-8 ${isRTL ? "lg:pl-4" : "lg:pr-4"}`}
        >
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
            <div
              className={`relative hidden xl:flex ${isRTL ? "sm:left-10" : "sm:right-10"} sm:top-20 sm:z-10 border-2 border-[#f2f5ff] h-96 sm:h-[400px] w-full rounded-lg overflow-hidden shadow-xl`}
            >
              <Image
                src={About2}
                alt="Our Travel Company"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
        <div
          className={`w-full lg:w-1/2 lg:mt-0 px-4 md:px-0 ${isRTL ? "lg:text-right" : ""}`}
        >
          <h1 className="text-2xl sm:text-4xl h-16 font-bold text-center bg-clip-text text-transparent bg-mainGradient">
            {t("aboutUs")}
          </h1>

          <div className="space-y-4 w-full text-gray-700 mt-4 md:mt-8 lg:mt-10">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p
                className={`text-sm sm:text-base ${isRTL ? "text-right" : ""}`}
              >
                {t("about1")}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p
                className={`text-sm sm:text-base ${isRTL ? "text-right" : ""}`}
              >
                {t("about2")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <OwnerSection />
    </div>
  );
}

export default Page;
