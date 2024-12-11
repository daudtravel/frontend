"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const authClickHandler = (name: string) => {
    router.push(`${pathname}?${name}`);
  };

  return (
    <header className="top-0 w-full bg-[#f2f5ff] shadow-md z-50">
      <div className="flex w-full items-center justify-between px-4 md:px-20 h-20">
        <div className="font-bold text-xl">Logo</div>

        <nav className="md:flex items-center gap-3 md:gap-5 hidden">
          <Link href="/" className="text-sm font-medium text-black">
            HOME
          </Link>
          <Link href="/contact" className="text-sm font-medium text-black">
            CONTACT
          </Link>
          <Link href="/tours" className="text-sm font-medium text-black">
            TOURS
          </Link>
          <Link href="/about" className="text-sm font-medium text-black">
            ABOUT
          </Link>

          <div className="flex items-center gap-2">
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => authClickHandler("signin")}
                className="text-black hover:text-gray-900 hover:bg-gray-100"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>

              <Button
                size="sm"
                onClick={() => authClickHandler("signup")}
                className="bg-blue-600 text-black hover:bg-blue-700"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </>
          </div>
        </nav>
      </div>
    </header>
  );
}
