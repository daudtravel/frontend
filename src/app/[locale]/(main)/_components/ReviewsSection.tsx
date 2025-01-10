import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { StarIcon } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Alice Johnson",
    rating: 5,
    comment:
      "Absolutely stunning! The cottage exceeded all our expectations. Can't wait to come back!",
  },
  {
    id: 2,
    name: "Bob Smith",
    rating: 4,
    comment:
      "Great location, very peaceful. The amenities were top-notch. Highly recommend for a weekend getaway.",
  },
  {
    id: 3,
    name: "Carol Davis",
    rating: 5,
    comment:
      "We had an amazing time. The cottage was spotless and the surroundings were breathtaking.",
  },
  {
    id: 4,
    name: "David Brown",
    rating: 5,
    comment:
      "Perfect place to unwind and reconnect with nature. The hosts were incredibly helpful and friendly.",
  },
  {
    id: 5,
    name: "Eva Wilson",
    rating: 4,
    comment:
      "Cozy, comfortable, and charming. We enjoyed every moment of our stay. Will definitely return!",
  },
  {
    id: 6,
    name: "Frank Miller",
    rating: 5,
    comment:
      "A hidden gem! The attention to detail in the cottage's decor and amenities was impressive.",
  },
];

const ReviewsSection = () => {
  return (
    <section className="md:pt-12 md:pb-20 pb-12 flex w-full flex-col items-center">
      <h1 className="text-2xl md:text-4xl text-center mb-5 md:mb-10">
        What Our Guests Say
      </h1>
      <Carousel
        opts={{
          align: "start",
        }}
        className="mt-6 w-full p-0 "
      >
        <CarouselContent className="gap-2 md:gap-4 mx-4 md:mx-20">
          {reviews.map((item, index) => (
            <CarouselItem
              key={index}
              className="w-full rounded-xl border border-gray-300 bg-[#f2f5ff] md:basis-1/2 lg:basis-1/3"
            >
              <div className="flex h-full flex-col justify-between p-6">
                <div>
                  <div className="mb-4 flex items-center">
                    {[...Array(item.rating)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="md:mb-4 mb-2 text-xs md:text-sm text-gray-600">{item.comment}</p>
                </div>
                <p className="md:text-base text-sm font-semibold">{item.name}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="hidden md:block md:absolute -top-20 md:right-20 lg:right-40">
          <CarouselPrevious className="bg-mainGradient text-white w-10 h-10 border-white rounded-md border hover:bg-mainGradientHover hover:text-white" />
          <CarouselNext className="bg-mainGradient text-white w-10 h-10 border-white rounded-md border hover:bg-mainGradientHover hover:text-white" />
        </div>
      </Carousel>
    </section>
  );
};

export default ReviewsSection;
