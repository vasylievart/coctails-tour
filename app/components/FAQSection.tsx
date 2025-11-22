"use client";

import {useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { faqs } from "../data/faq";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);


  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      //className="max-w-3xl mx-auto py-16 px-4 z-40"
      className="
        w-[95%] sm:w-[90%] md:max-w-3xl
        mx-auto py-10 sm:py-14 md:py-16 px-3 sm:px-6
        z-40
        "
      >
      <h2 
        //className="flex justify-center items-center gap-4 text-3xl font-bold text-center text-shadow-lg mb-10 text-white"
        className="
          flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4
          text-2xl sm:text-3xl md:text-4xl font-bold text-center
          text-white text-shadow-lg mb-8 sm:mb-10
          "
        >
        Frequently Asked Questions
        <Image 
          src='/images/faq/faq_web.webp' 
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
          <div
            key={index}
            //className="border-2 border-white rounded-2xl overflow-hidden shadow-sm"
            className="
              border border-amber-100/70 rounded-2xl overflow-hidden shadow-md
              bg-amber-700/40 backdrop-blur-sm
            "
          >
            <button
              onClick={() => toggle(index)}
              //className="w-full flex justify-between items-center text-left px-6 py-4 bg-amber-700/50 hover:bg-amber-600/50 shadow-sm transition"
              className="
                w-full flex justify-between items-center text-left
                px-4 sm:px-6 py-3 sm:py-4
                bg-amber-700/40 hover:bg-amber-600/50
                transition-all duration-300
              "
            >
              <span className="font-semibold text-base sm:text-lg md:text-xl text-white leading-snug">
                {faq.question}
              </span>
             
              <Image
                className={`
                  w-8 sm:w-10 md:w-12 h-auto transition-transform
                  ${openIndex === index ? "rotate-180 duration-300" : ""}
                `}
                src="/images/faq/barcelona_pavement_style.png"
                alt="Barcelona's Pavement"
                width={48}
                height={48}
                loading="eager"
              />
            </button>

            <AnimatePresence  initial={false}>
              {openIndex === index && (
                <motion.div
                  initial={false}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col px-6 pb-4 bg-white text-amber-900"
                >
                  <p className="text-sm sm:text-base md:text-lg mb-3 sm:mb-4">{faq.answer}</p>
                  {faq.images && (
                    <motion.div        
                      variants={{
                        visible: {
                          transition: {staggerChildren: 0.2},
                        }
                      }}
                      className="flex flex-row-reverse mr-48 gap-2"
                    >
                      {faq.images.map((img, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: -600, opacity: 0 }}
                          animate={{x:200, opacity:1, rotate:360}}
                          exit={{ x: 100, opacity: 0, rotate: -360 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                          variants={{
                            hidden: {opacity: 0, y: 30, rotate: -10},
                            visible: {
                              opacity: 1,
                              y:0,
                              rotate:0,
                              transition: {duration: 0.6},
                            }
                          }}
                          whileHover={{scale: 1.1}}
                        >
                          <Image
                            src={img.src}
                            alt={img.alt}
                            width={img.width}
                            height={img.height}
                            className="w-16 sm:w-4 md:w-8 lg:w-12 h-auto object-contain"
                            loading="lazy"
                            sizes="(max-width: 640px) 25vw, (max-width: 1024px) 15vw, 10vw"
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
     )}
      
    </section>
  );
}
