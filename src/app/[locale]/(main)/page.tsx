import CoverSection from "./_components/CoverSection";
import FaqSection from "./_components/FaqSection";
import ReviewsSection from "./_components/ReviewsSection";
import Test from "./_components/Test";
import ToursSection from "./_components/ToursSection";
import TransferSection from "./_components/TransferSection";
import WhyUsSection from "./_components/WhyUsSection";

export default function Page() {
  return (
    <main className="w-full relative">
      <CoverSection />
      <ToursSection />
      <TransferSection />
      <ReviewsSection />
      <WhyUsSection />
      <FaqSection />
      <Test />
    </main>
  );
}
