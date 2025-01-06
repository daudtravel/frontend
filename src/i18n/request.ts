/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Load all JSON files for the current locale
  const messages = {
    meta: (await import(`../messages/${locale}/meta.json`)).default,
    header: (await import(`../messages/${locale}/header.json`)).default,
    main: (await import(`../messages/${locale}/main.json`)).default,
    contact: (await import(`../messages/${locale}/contact.json`)).default,

  };

  return {
    locale,
    messages,
  };
});
