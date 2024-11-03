export default function Header() {
  return (
    <>
      <section className="w-full shadow-lg">
        <div className="flex w-full items-center justify-between px-20 h-20">
          <div>Logo</div>
          <div className="flex gap-5 text-base text-white">
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
