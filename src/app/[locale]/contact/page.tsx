import { getTranslations } from "next-intl/server";
import ContactCard from "./_components/ContactCard";

export async function generateMetadata() {
  // const { locale } = await params;
  // const t = await getTranslations("meta");
  // return {
  //   title: t("contact"),
  //   description: t("descriptionContact"),
  //   openGraph: {
  //     title: t("contact"),
  //     description: t("descriptionContact"),
  //     type: "website",
  //     locale: locale,
  //     url: "https://www.chateauiveri.ge/contact",
  //     siteName: "Chateau Iveri",
  //   },
  // };
}

// Mark the page component as async to use server components
export default async function page() {
  // You can also get translations directly in the page component if needed
  const t = await getTranslations("contact");

  console.log(t("hello"));

  return (
    <>
      <ContactCard />
    </>
  );
}
