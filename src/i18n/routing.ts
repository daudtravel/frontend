import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = ["en", "ka"] as const; // Define supported locales
export type Locale = (typeof locales)[number]; // Create a type for the

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["ka", "en"],

  // Used when no locale matches
  defaultLocale: "ka",
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
