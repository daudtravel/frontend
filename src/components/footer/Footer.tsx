"use client";

import { useTranslations } from "next-intl";

export const Social = () => {
  return (
    <>
      <div className="flex flex-row  gap-x-6">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.facebook.com/Chateauiveri"
        >
          {/* <WhiteFb className="h-5 w-5" /> */}
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.instagram.com/chateau.iveri"
        >
          {/* <WhiteInsta className="h-5 w-5" /> */}
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://wa.me/%2B995599716263"
        >
          {/* <WhiteWatsapp className="h-5 w-5" /> */}
        </a>
      </div>
    </>
  );
};

export default function Footer() {
  const t = useTranslations("NavbarLinks");

  return (
    <>
      <section className="relative flex h-auto w-full flex-col bg-slate-400">
        <div className="z-50 w-full px-5 py-2 pt-12  md:px-7 md:pt-16 xl:px-24 xl:pt-20">
          <div className="flex flex-col px-6  md:flex-row md:items-start md:justify-between md:px-0">
            <span>{t("home")}</span>

            {/* <div className="mt-10 flex flex-col gap-y-4 md:mt-0">
              <Link href="/">
                <span
                  className={`${
                    pathname === "/" ? "underline" : ""
                  } cursor-pointer text-sm  text-white hover:underline `}
                >
                  {t("main")}
                </span>
              </Link>

              <div className="grid grid-cols-2 gap-y-4 md:grid-cols-2 lg:gap-x-20">
                <Link href="/hotel">
                  <span
                    className={`${
                      pathname === "/hotel" ? "underline" : ""
                    } cursor-pointer text-sm  text-white hover:underline `}
                  >
                    {t("hotel")}
                  </span>
                </Link>
                <Link href="/kitchen">
                  <span
                    className={`${
                      pathname === "/kitchen" ? "underline" : ""
                    } cursor-pointer text-sm  text-white hover:underline `}
                  >
                    {t("kitchen")}
                  </span>
                </Link>
                <Link href="/winery">
                  <span
                    className={`${
                      pathname === "/winery" ? "underline" : ""
                    } cursor-pointer text-sm  text-white hover:underline `}
                  >
                    {t("winery")}
                  </span>
                </Link>
                <Link href="/event">
                  <span
                    className={`${
                      pathname === "/event" ? "underline" : ""
                    } cursor-pointer text-sm  text-white hover:underline `}
                  >
                    {t("events")}
                  </span>
                </Link>

                <Link href="/contact">
                  <span
                    className={`${
                      pathname === "/contact" ? "underline" : ""
                    } cursor-pointer text-sm  text-white hover:underline `}
                  >
                    {t("contact")}
                  </span>
                </Link>
                <Link href="/meeting">
                  <span
                    className={`${
                      pathname === "/meeting" ? "underline" : ""
                    } cursor-pointer text-sm  text-white hover:underline `}
                  >
                    {t("meetings")}
                  </span>
                </Link>
                <Link href="/about">
                  <span
                    className={`${
                      pathname === "/about" ? "underline" : ""
                    } cursor-pointer text-sm  text-white hover:underline `}
                  >
                    {t("about")}
                  </span>
                </Link>
                <a
                  className={`cursor-pointer text-sm  text-white hover:underline `}
                  href="https://www.booking.com/hotel/ge/chateau-iveri.en-gb.html?aid=304142&checkin=2024-07-12&checkout=2024-07-13&dest_id=6831623&dest_type=hotel&group_adults=2&group_children=0&label=gen173nr-1BCAEoggI46AdIM1gEaFKIAQGYAQm4ARjIAQzYAQHoAQGIAgGoAgS4Aqfjj7QGwAIB0gIkZTAxYTlmNTEtODkzZi00OTM2LTlmMDUtMWFmYzNhZTRkNzg12AIF4AIB-Share-wuv3i61%401719923173&no_rooms=1&req_adults=2&req_children=0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("book")}
                </a>
              </div>
            </div> */}
            <div className="mt-10 flex flex-col md:mt-0 ">
              <h1 className="text-sm font-semibold text-white">Contact</h1>
              <div className="mt-4 flex  flex-col gap-4 md:grid md:grid-cols-1 ">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="tel:+995599716263"
                >
                  <div className="flex cursor-pointer  flex-row items-center">
                    {/* <PhoneCall className="h-4 w-4" /> */}

                    <span className="ml-2 text-sm text-white hover:underline">
                      +995 599 71 62 63
                    </span>
                  </div>
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="mailto:chateauiveri@gmail.com"
                >
                  <div className="flex cursor-pointer  flex-row items-center">
                    {/* <Message className="h-4 w-4" /> */}

                    <span className="ml-2 text-sm text-white hover:underline">
                      chateauiveri@gmail.com
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col px-6 md:flex-row  md:items-center md:justify-end md:px-0 md:py-4">
            <div className="mt-8 flex flex-col md:order-2 md:mt-0 ">
              <div className="mt-4 md:mt-0">
                <Social />
              </div>
            </div>

            <div className="mt-8 h-[1px] w-full bg-white md:mt-0 md:hidden "></div>
          </div>
          <div className="mt-6 hidden h-[1px]  w-full bg-white md:block"></div>
          <div className="flex flex-row items-center  justify-center  py-4 md:justify-center">
            <p className="text-[10px] text-white">Copyrighyt 2024</p>
          </div>
        </div>
      </section>
    </>
  );
}
