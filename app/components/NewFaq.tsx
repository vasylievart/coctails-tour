"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { faqs } from "../data/faq";
import ImageAction from "./ImageAction";

export default function NewFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);



  return (
    <section
      className="
        w-[95%] sm:w-[90%] md:max-w-3xl
        mx-auto py-10 sm:py-14 md:py-16 px-3 sm:px-6
        z-30
      "
    >
      <h2
        className="
          flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4
          text-2xl sm:text-3xl md:text-4xl font-bold text-center
          text-white text-shadow-lg mb-8 sm:mb-10
        "
      >
        Frequently Asked Questions
        <Image
          src="/images/faq/faq_web.webp"
          alt="Frequently Asked Questions"
          width={96}
          height={96}
          className="w-16 sm:w-20 md:w-28 h-auto"
          loading="lazy"
        />
      </h2>

      {mounted && (
        <div className="space-y-4 sm:space-y-4">
          {faqs.map((faq, index) => (
            <ImageAction key={index} index={index} openIndex={openIndex} setOpenIndex={setOpenIndex} faq={faq}/>
          ))}
        </div>
      )}
    </section>
  );
}
