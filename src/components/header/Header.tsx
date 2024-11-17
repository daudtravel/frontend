"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

export default function Header() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const signupClickHandler = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (newSearchParams.has("signup")) {
      if (newSearchParams.get("signup") === "true") return;
      newSearchParams.set("signup", "true");
    } else {
      newSearchParams.append("signup", "true");
    }

    const queryString = newSearchParams.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, {
      scroll: false,
    });
  };

  const signinClickHandler = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (newSearchParams.has("signin")) {
      if (newSearchParams.get("signin") === "true") return;
      newSearchParams.set("signin", "true");
    } else {
      newSearchParams.append("signin", "true");
    }

    const queryString = newSearchParams.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, {
      scroll: false,
    });
  };

  return (
    <header className="sticky top-0 w-full bg-white z-50 shadow-sm">
      <div className="flex w-full items-center justify-between px-4 md:px-20 h-20">
        <div className="font-bold text-xl">Logo</div>

        <nav className="flex items-center gap-3 md:gap-5">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            HOME
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            CONTACT
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={signinClickHandler}
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>

            <Button
              size="sm"
              onClick={signupClickHandler}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
