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
import VideoGallery from "./_components/VideoGallerySection";
import VideoGalleryFirst from "./_components/VideoGalleryFirst";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("meta");

  const baseUrl = "https://www.daudtravel.com";
  const currentUrl = `${baseUrl}/${locale}`;

  const metadata: Metadata = {
    title: t("main"),
    description: t("descriptionMain"),
    keywords: t("keywords"),
    authors: [{ name: "Daud Travel" }],
    creator: "Daud Travel",
    publisher: "Daud Travel",

    alternates: {
      canonical: currentUrl,
      languages: {
        en: `${baseUrl}/en`,
        ka: `${baseUrl}/ka`,
        ru: `${baseUrl}/ru`,
        tr: `${baseUrl}/tr`,
        ar: `${baseUrl}/ar`,
      },
    },
    openGraph: {
      title: t("main"),
      description: t("descriptionMain"),
      type: "website",
      locale: locale,
      url: currentUrl,
      siteName: "Daud Travel",
      images: [
        {
          url: `${baseUrl}/images/MainOG.png`,
          width: 1200,
          height: 630,
          alt: t("main"),
          type: "image/png",
        },
        {
          url: `${baseUrl}/images/MainOG-square.png`,
          width: 1080,
          height: 1080,
          alt: t("main"),
          type: "image/png",
        },
      ],
    },

    category: "Travel",

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };

  return metadata;
}

export default function Page() {
  return (
    <main className="w-full relative">
      <CoverSection />
      <IndividualToursSection />
      <GroupToursSection />
      <WhyUsSection />
      <VideoGalleryFirst />
      <TransferSection />
      <Gallery />
      <ReviewsSection />
      <FaqSection />
      <VideoGallery />
    </main>
  );
}
