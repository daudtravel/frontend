import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = ["en", "ka", "ru"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales: ["ka", "en", "ru"],
  defaultLocale: "ka",
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
