import { getTranslations } from "next-intl/server";
import ContactCard from "./_components/ContactCard";
import { Locale } from "@/src/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("meta");
  return {
    title: t("contact"),
    description: t("descriptionContact"),
    openGraph: {
      title: t("contact"),
      description: t("descriptionContact"),
      type: "website",
      locale: locale,
      url: "https://www.daudtravel.com/contact",
      siteName: "Daud Travel",
    },
  };
}
export default async function page() {
  return (
    <>
      <ContactCard />
    </>
  );
}
