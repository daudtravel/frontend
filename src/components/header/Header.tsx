"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, UserPlus, User, LogOut } from "lucide-react";
import { useAuth } from "@/src/auth/authProvider";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/src/i18n/LocaleSwitcher";
import AuthLoader from "../shared/loader/AuthLoader";

export default function Header() {
  const t = useTranslations("header");
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading: isUserLoading, logout } = useAuth();

  const authClickHandler = (name: string) => {
    router.push(`${pathname}?${name}`);
  };

  const buttonStyles =
    "flex items-center gap-2 bg-white cursor-pointer rounded-full px-3 py-2 shadow-sm hover:bg-gray-50 transition-colors";
  const iconStyles = "h-5 w-5 text-blue-600";
  const textStyles = "text-sm font-medium text-gray-700";

  return (
    <header className="top-0 w-full bg-[#f2f5ff] shadow-md z-50">
      <div className="flex w-full items-center justify-between px-4 md:px-20 h-20">
        <Link href="/">
          <div>Logo</div>
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

          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <button
                  disabled={isUserLoading}
                  onClick={() => authClickHandler("signin")}
                  className={buttonStyles}
                >
                  <LogIn className={`${iconStyles} text-main`} />
                  <span className={textStyles}>
                    {isUserLoading ? <AuthLoader /> : t("signin")}
                  </span>
                </button>
                <button
                  disabled={isUserLoading}
                  onClick={() => authClickHandler("signup")}
                  className={buttonStyles}
                >
                  <UserPlus className={`${iconStyles} text-main`} />
                  <span className={textStyles}>
                    {isUserLoading ? <AuthLoader /> : t("signup")}
                  </span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className={buttonStyles}>
                  <User className={`${iconStyles} text-main`} />
                  <span className={textStyles}>
                    {user?.firstname || "User"}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className={`${buttonStyles} hover:bg-red-50`}
                >
                  <LogOut className="h-5 w-5 text-red-600" />
                  <span className={textStyles}>{t("logout")}</span>
                </button>
              </div>
            )}
          </div>
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  );
}
