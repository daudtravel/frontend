import CoverSection from "./_components/CoverSection";
import CoverTest from "./_components/CoverTest";

import FaqSection from "./_components/FaqSection";
import ReviewsSection from "./_components/ReviewsSection";
import ToursSection from "./_components/ToursSection";
import TransferSection from "./_components/TransferSection";


export default function Page() {
  return (
    <main className="w-full relative ">
      {/* <CoverTest /> */}
      <CoverSection />
      <ToursSection />
      <CoverTest/>
      <TransferSection />
      <ReviewsSection />
      <FaqSection />
    </main>
  );
}
