import Link from "next/link";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function BurgerMenu() {
  const t = useTranslations("header");
  const [isOpen, setIsOpen] = useState(false);
  const closeSheet = () => setIsOpen(false);

  return (
    <header className="w-full flex md:hidden items-center">
      <div className="ml-auto flex items-center space-x-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <MenuIcon className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetTitle className="text-lg font-semibold mb-4">
              Daud Travel
            </SheetTitle>
            <nav className="grid gap-6 p-6">
              <Link
                href="/"
                className="text-sm font-medium hover:underline underline-offset-4"
                prefetch={false}
                onClick={closeSheet}
              >
                {t("main")}
              </Link>
              <Link
                href="/tours"
                className="text-sm font-medium hover:underline underline-offset-4"
                prefetch={false}
                onClick={closeSheet}
              >
                {t("tours")}
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium hover:underline underline-offset-4"
                prefetch={false}
                onClick={closeSheet}
              >
                {t("about")}
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium hover:underline underline-offset-4"
                prefetch={false}
                onClick={closeSheet}
              >
                {t("contact")}
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
