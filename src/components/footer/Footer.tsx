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
        ></a>
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
  const t = useTranslations("main");

  return (
    <>
      <footer className="relative flex h-auto w-full flex-col bg-mainGradientHover">
        <div className="flex flex-row items-center  justify-center  py-3 md:justify-center">
          <p className="text-xs text-white">© 2025 Daud Travel </p>
        </div>
      </footer>
    </>
  );
}
