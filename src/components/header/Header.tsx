"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { LogIn, UserPlus, User, LogOut } from "lucide-react";
import { useAuth } from "@/src/auth/authProvider";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading: isUserLoading, logout } = useAuth();

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
          <Link href="/profile" className="text-sm font-medium text-black">
            PROFILE
          </Link>

          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUserLoading}
                  onClick={() => authClickHandler("signin")}
                  className="text-black hover:text-gray-900 hover:bg-gray-100"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {isUserLoading ? "Checking..." : "Sign In"}
                </Button>

                <Button
                  size="sm"
                  disabled={isUserLoading}
                  onClick={() => authClickHandler("signup")}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {isUserLoading ? "Checking..." : "Sign Up"}
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
                  Logout
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
