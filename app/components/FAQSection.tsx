"use client";

import {useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { faqs } from "../data/faq";





export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-3xl mx-auto py-16 px-4 z-50">
      <h2 className="flex justify-center items-center gap-4 text-3xl font-bold text-center text-shadow-lg mb-10 text-white">
        Frequently Asked Questions
        <Image src='/images/faq/faq_web.webp' alt="Frequently Asked Questions" width={128} height={128}/>
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-2 border-white rounded-2xl overflow-hidden shadow-sm"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center text-left px-6 py-4 bg-amber-700/50 hover:bg-amber-600/50 shadow-sm transition"
            >
              <span className="font-semibold text-lg text-white text-shadow-md">
                {faq.question}
              </span>
              <Image className={`h-12 w-12 text-amber-800 transition-transform ${
                  openIndex === index ? "rotate-180 duration-300" : ""
                }`} src="/images/faq/barcelona_pavement_style.png" alt="Barcelona's Pavement" width={48} height={48} loading="lazy"/>
            </button>

            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-4 bg-white text-amber-900"
                >
                  <p className="text-base mb-4">{faq.answer}</p>
                  {faq.images && (
                    <motion.div        
                      variants={{
                        visible: {
                          transition: {staggerChildren: 0.2},
                        }
                      }}
                      className="flex justify-center flex-wrap gap-2"
                    >
                      {faq.images.map((img, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: -600, opacity: 0 }}
                          animate={{x:200, opacity:1, rotate:360}}
                          exit={{ x: 100, opacity: 0, rotate: -360 }}
                          transition={{ duration: 0.3 }}
                          variants={{
                            hidden: {opacity: 0, y: 30, rotate: -10},
                            visible: {
                              opacity: 1,
                              y:0,
                              rotate:0,
                              transition: {duration: 0.3},
                            }
                          }}
                          whileHover={{scale: 1.1}}
                        >
                          <Image
                            src={img.src}
                            alt={img.alt}
                            width={img.width}
                            height={img.height}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
