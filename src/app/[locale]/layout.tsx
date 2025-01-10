import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "@/src/components/header/Header";
import Footer from "@/src/components/footer/Footer";
import { Locale, routing } from "@/src/i18n/routing";
import Script from "next/script";
import "./globals.css";

import SignInModal from "./(auth)/_signin/SigninModal";
import QueryProvider from "@/src/reactQuery/queryProvider";
import { AuthProvider } from "@/src/auth/authProvider";
import SignupModalWrapper from "./(auth)/_signup/SignupModalWrapper";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <Script id="tawk-widget" strategy="afterInteractive">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/6780f63c49e2fd8dfe058a1a/1ih7s3n3p';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>
        <AuthProvider>
          <QueryProvider>
            <NextIntlClientProvider messages={messages}>
              <Header />
              <SignupModalWrapper />
              <SignInModal />
              {children}
              <Footer />
            </NextIntlClientProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
