"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
 
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
      question:
        "question1 question1question1question1question1question1question1question1question1question1question1",
      answer:
        "answer1 question1question1question1question1question1question1question1question1",
    },
    {
      value: "item-2",
      question:
        "question2 question1question1question1question1question1question1question1",
      answer: "answer2 question1question1question1question1question1question1",
    },
    {
      value: "item-3",
      question: "question3 question1question1question1question1question1",
      answer:
        "answer3 question1question1question1question1question1question1question1question1question1",
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
    <section className="bg-[#f2f5ff] px-6 pb-12 pt-6 sm:px-16 md:px-20 xl:px-24 ">
      <h1 className="font-bgCaps text-xl">{"questionsHead"}</h1>
      {items.map((item) => (
        <Accordion
          key={item.value}
          type="single"
          collapsible
          className="mt-6 w-full rounded-lg bg-gray-400"
        >
          <AccordionItem
            value={item.value}
            style={{ backgroundColor: bgColor(item.value) }}
            className="rounded-lg  bg-slate-500"
          >
            <div
              onClick={() => handleClick(item.value)}
              className="flex w-full flex-row  items-center rounded-lg"
            >
              <div className="w-full ">
                <AccordionTrigger className="items-start justify-start text-left text-[14px] font-semibold">
                  {item.question}
                </AccordionTrigger>
              </div>
            </div>
            <AccordionContent className="p-4 pt-0 text-left text-xs leading-5 md:pl-12">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </section>
  );
}
