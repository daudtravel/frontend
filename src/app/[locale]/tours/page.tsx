import { getTranslations } from "next-intl/server";
import ToursSection from "./_components/ToursSection";
import { Locale } from "@/src/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("meta");
  return {
    title: t("tours"),
    description: t("descriptionTours"),
    openGraph: {
      title: t("tours"),
      description: t("descriptionTours"),
      type: "website",
      locale: locale,
      url: "https://www.daudtravel.com/tours",
      siteName: "Daud Travel",
      images: [
        {
          url: "/images/Svaneti.jpg",
        },
      ],
    },
  };
}

export default function Page() {
  return <ToursSection />;
}
