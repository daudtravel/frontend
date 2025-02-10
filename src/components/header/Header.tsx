"use client"

import Link from "next/link";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/src/i18n/LocaleSwitcher";
import BurgerMenu from "./BurgerMenu";

export default function Header() {
  const t = useTranslations("header");

   // const { user, isAuthenticated, isLoading: isUserLoading, logout } = useAuth();

  // const authClickHandler = (name: string) => {
  //   router.push(`${pathname}?${name}`);
  // };

  // const buttonStyles =
  //   "flex items-center gap-2 bg-white cursor-pointer rounded-full px-3 py-2 shadow-sm hover:bg-gray-50 transition-colors";
  // const iconStyles = "h-5 w-5 text-blue-600";
  // const textStyles = "text-sm font-medium text-gray-700";

  return (
    <header className="top-0 w-full bg-[#f2f5ff] shadow-md z-50">
      <div className="flex w-full items-center justify-between px-4 md:px-20 h-20">
        <Link href="/" className="w-[300px]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300">
            <defs>
              <linearGradient id="titleGradient" x1="0%" y1="0%">
                <stop offset="0%" stopColor="#FF6B6B"/>
                <stop offset="50%" stopColor="#FF8E53"/>
                <stop offset="100%" style={{ stopColor: "#FFA41B" }}/>
              </linearGradient>
            </defs>

            <text x="600" y="180" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="120" fill="url(#titleGradient)" letterSpacing="35">
              DAUD
            </text>

            <text x="600" y="235" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="42" letterSpacing="25">
              <tspan fill="#FF6B6B">T</tspan>
              <tspan fill="#FF8E53">R</tspan>
              <tspan fill="#FF8E53">A</tspan>
              <tspan fill="#FF8E53">V</tspan>
              <tspan fill="#FFA41B">E</tspan>
              <tspan fill="#FFA41B">L</tspan>
            </text>

            <path d="M350 250 C525 235, 675 235, 850 250" stroke="url(#titleGradient)" strokeWidth="4" fill="none"/>
          </svg>
        </Link>
        <nav className="lg:flex items-center gap-3 md:gap-4 items-center  hidden">
          {[
            { href: "/", label: t("main") },
            { href: "/tours", label: t("tours") },
            { href: "/transfers", label: t("transfers") },
            { href: "/about", label: t("about") },
            { href: "/contact", label: t("contact") }
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <span className="relative tracking-widest text-base font-bold bg-main bg-clip-text text-transparent drop-shadow-md leading-none group cursor-pointer px-4 py-2">
                {item.label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF6B6B] via-[#FF8E53] to-[#FFA41B] transform scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
                <span className="absolute top-0 left-0 w-full h-full bg-white/10 rounded-lg transform scale-y-0 transition-transform duration-300 ease-in-out group-hover:scale-y-100"></span>
              </span>
            </Link>
          ))}

          {/* Auth buttons section preserved */}
          {/* <div className="flex items-center gap-3">
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
          </div> */}
          <LocaleSwitcher />
        </nav>
        <BurgerMenu />
      </div>
    </header>
  );
}