import Link from "next/link";

export default function Header() {
  return (
    <>
      <section className="w-full    z-[1000000000] h-20">
        <div className="flex w-full items-center justify-between px-20 h-20 text-black">
          <div>Logo</div>
          <div className="flex gap-5 text-base text-black">
            <Link href="/">
              <span className="cursor-pointer">HOME</span>
            </Link>
            <Link href="/contact">
              <span className="cursor-pointer">CONTACT</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
