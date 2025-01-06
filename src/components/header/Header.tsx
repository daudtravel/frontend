"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { LogIn, UserPlus, User, LogOut } from "lucide-react";
import { useAuth } from "@/src/auth/authProvider";
import { useTranslations } from "next-intl";

import LocaleSwitcher from "@/src/i18n/LocaleSwitcher";

export default function Header() {
  const t = useTranslations("header");
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading: isUserLoading, logout } = useAuth();

  const authClickHandler = (name: string) => {
    router.push(`${pathname}?${name}`);
  };

  return (
    <header className="top-0 w-full bg-[#f2f5ff] shadow-md z-50">
      <div className="flex w-full items-center justify-between px-4 md:px-20 h-20">
        <Link href="/">
          <div className="font-bold text-xl">Logo</div>
        </Link>
        <nav className="md:flex items-center gap-3 md:gap-5 hidden">
          <Link href="/" className="text-base font-medium text-black">
            {t("main")}
          </Link>
          <Link href="/tours" className="text-base font-medium text-black">
            {t("tours")}
          </Link>
          <Link href="/about" className="text-base font-medium text-black">
            {t("about")}
          </Link>
          <Link href="/contact" className="text-base font-medium text-black">
            {t("contact")}
          </Link>

          <div className="flex items-center gap-5">
            {!isAuthenticated ? (
              <>
                <Button
                  disabled={isUserLoading}
                  onClick={() => authClickHandler("signin")}
                  className="text-white h-9"
                >
                  <LogIn className="mr-1 h-3 w-3" />
                  {isUserLoading ? "Checking..." : t("signin")}
                </Button>

                <Button
                  disabled={isUserLoading}
                  onClick={() => authClickHandler("signup")}
                  className="text-white h-9"
                >
                  <UserPlus className="mr-1 h-4 w-4" />
                  {isUserLoading ? "Checking..." : t("signup")}
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">{user?.firstname}</span>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => logout()}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("logout")}
                </Button>
              </div>
            )}
          </div>
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  );
}
