import CoverSection from "./_components/CoverSection";
import WhyUsSection from "./_components/WhyUsSection";
import FaqSection from "./_components/FaqSection";
import Gallery from "./_components/Gallery";
import ReviewsSection from "./_components/ReviewsSection";
import ToursSection from "./_components/ToursSection";
import TransferSection from "./_components/TransferSection";

export default function Page() {
  return (
    <main className="w-full relative ">
      <CoverSection />
      <ToursSection />
      <WhyUsSection />
      <TransferSection />
      <Gallery />
      <ReviewsSection />
      <FaqSection />
    </main>
  );
}
