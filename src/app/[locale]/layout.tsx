import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "@/src/components/header/Header";
import Footer from "@/src/components/footer/Footer";
import { Locale, routing } from "@/src/i18n/routing";
import "./globals.css";
import SignUpModal from "./(auth)/_signup/SignupModalWrapper";
import SignInModal from "./(auth)/_signin/SigninModal";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale }; // Remove Promise wrapper
}) {
  const { locale } = params; // Now this should work correctly

  if (!routing.locales.includes(locale)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <SignUpModal />
          <SignInModal />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
