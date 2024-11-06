"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";

import { useState } from "react";

type AccordionItems = {
  value: string;
  question: string;
  answer: string;
};

export default function FaqSection() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const items: AccordionItems[] = [
    {
      value: "item-1",
      question: "What happens if my flight is delayed?",
      answer:
        "We monitor all flight arrivals in real-time and adjust your pickup time accordingly at no extra charge. Our drivers will wait up to 60 minutes after your actual arrival time. We'll also provide you with a direct contact number to communicate any changes.",
    },
    {
      value: "item-2",
      question: "Can I book a driver for multiple stops or an entire day?",
      answer:
        "Yes! We offer both hourly and daily booking options. For city tours, you can book our driver for a minimum of 4 hours or for a full day (up to 8 hours). All stops should be specified during booking to ensure proper planning. Additional stops during the journey may incur extra charges.",
    },
    {
      value: "item-3",
      question: "What's included in the transfer price?",
      answer:
        "Our transfer price includes: Professional licensed driver, Fuel costs, Vehicle insurance, Meet & greet service at airports/hotels, Free waiting time (60 mins for airports, 15 mins for other locations), Luggage assistance, and All local taxes. Additional services like child seats can be arranged for a small fee.",
    },
  ];

  const handleClick = (value: string) => {
    setOpenItems((prevOpenItems) => ({
      ...prevOpenItems,
      [value]: !prevOpenItems[value],
    }));
  };
  const bgColor = (value: string) => (openItems[value] ? "#DFE6FC" : "#f2f5ff");

  return (
    <section className="bg-[#f2f5ff] w-full px-6  py-12 sm:px-16 md:px-20 xl:px-24 ">
      <h1 className="text-xl">{"Frequently Asked Questions"}</h1>
      {items.map((item) => (
        <Accordion
          key={item.value}
          type="single"
          collapsible
          className="mt-6 w-full rounded-lg bg-gray-400  "
        >
          <AccordionItem
            value={item.value}
            style={{ backgroundColor: bgColor(item.value) }}
            className="rounded-lg  bg-slate-500  border-2 w-full"
          >
            <div
              onClick={() => handleClick(item.value)}
              className="flex w-full flex-row  items-center rounded-lg"
            >
              <div className="w-full ">
                <AccordionTrigger className="items-start justify-between text-left flex w-full text-[14px] font-semibold px-4">
                  {item.question}
                </AccordionTrigger>
              </div>
            </div>
            <AccordionContent className="p-2 pt-0 text-left text-xs leading-5 md:pl-6">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </section>
  );
}
