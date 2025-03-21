import CoverSection from "./_components/CoverSection";
import WhyUsSection from "./_components/WhyUsSection";
import FaqSection from "./_components/FaqSection";
import Gallery from "./_components/Gallery";
import ReviewsSection from "./_components/ReviewsSection";
import TransferSection from "./_components/TransferSection";
import { getTranslations } from "next-intl/server";
import { Locale } from "@/src/i18n/routing";
import IndividualToursSection from "./_components/IndividualTours";
import GroupToursSection from "./_components/GroupToursSection";
import { SocialSection } from "./_components/SocialSection";
import VideoGallery from "./_components/VideoGallerySection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("meta");
  return {
    title: t("main"),
    description: t("descriptionMain"),
    openGraph: {
      title: t("main"),
      description: t("descriptionMain"),
      type: "website",
      locale: locale,
      url: "https://www.daudtravel.com/",
      siteName: "Daud Travel",
      images: [
        {
          url: "/images/MainOG.png",
        },
      ],
    },
  };
}

export default function Page() {
  return (
    <main className="w-full relative">
    <CoverSection />
    <IndividualToursSection />
    <GroupToursSection />
    <WhyUsSection />
    <TransferSection />
    <Gallery />
    <ReviewsSection />
    <FaqSection />
 

      <VideoGallery/>
      <SocialSection />
 
  </main>
  );
}
