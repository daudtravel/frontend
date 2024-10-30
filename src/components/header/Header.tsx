import { Phone } from "lucide-react";
// import { Fb, Instagram, Location, Whatsapp } from "../svg";

export default function Header() {
  return (
    <>
      <section className="w-full hadow-lg">
        <div className="bg-amber-400 w-full justify-between bg-gradient-to-r from-orange-700 via-orange-600 to-yellow-500 h-9 items-center px-20 flex flex-row gap-5">
          <div className="flex flex-row w-auto gap-6 items-center">
            <div className="flex flex-row gap-1 items-center">
              <Phone className="fill-white h-5" />
              <span className="text-white text-base">+995 555 123 123</span>
            </div>
            <div className="flex flex-row gap-1 items-center">
              {/* <Location className="w-4 h-4 fill-white" /> */}
              <span className="text-white text-base">Batumi</span>
            </div>
          </div>

          <div className="flex flex-row gap-6">
            {/* <Fb className="w-5 h-5" />
            <Instagram className="w-5 h-5" />
            <Whatsapp className="w-5 h-5" /> */}
          </div>
        </div>
        <div className="flex w-full items-center justify-between px-20 h-16">
          <div>Logo</div>
          <div className="flex gap-5 text-base text-slate-700">
            <span className="cursor-pointer">HOME</span>
            <span className="cursor-pointer">TOURS</span>
            <span className="cursor-pointer">ABOUT</span>
            <span className="cursor-pointer">CONTACT</span>
          </div>
        </div>
      </section>
    </>
  );
}
