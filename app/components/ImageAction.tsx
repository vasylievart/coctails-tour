/*import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { FAQItem } from "../data/faq";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

interface ImageProps {
  index: number;
  openIndex: number | null;
  setOpenIndex: (value: number | null) => void;
  faq: FAQItem;
}

const ImageAction = ({ index, openIndex, setOpenIndex, faq }: ImageProps) => {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const isClosingRef = useRef(false);

  const toggle = (i: number) => {
    if (openIndex === i) {
      // closing — activate reverse animation
      isClosingRef.current = true;

      if (imageRef.current) {
        gsap.to(imageRef.current.querySelectorAll(".image-item"), {
          x: 100,
          opacity: 0,
          rotate: -360,
          duration: 0.4,
          ease: "power2.in",
          stagger: 0.05,
          onComplete: () => {
            setOpenIndex(null); // unmount AFTER animation
            isClosingRef.current = false;
          }
        });
      }
    } else {
      setOpenIndex(i);
    }
  };

  useLayoutEffect(() => {
    if (openIndex === index && imageRef.current) {
      // prevent triggering open animation during close
      if (isClosingRef.current) return;

      gsap.set(imageRef.current, {
        opacity: 0,
        x: -600,
        y: 30,
        rotate: -10
      });

      gsap.to(imageRef.current, {
        x: 0,
        y: 0,
        opacity: 1,
        rotate: -360,
        duration: 0.6,
        ease: "power2.in"
      });

      gsap.fromTo(
        imageRef.current.querySelectorAll(".image-item"),
        {
          opacity: 0,
          x: -600
        },
        {
          opacity: 1,
          x: 200,
          rotate: 360,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1
        }
      );
    }
  }, [openIndex]);

  return (
    <div
      key={index}
      className="
        border border-amber-100/70 rounded-2xl overflow-hidden shadow-md
        bg-amber-700/40 backdrop-blur-sm
      "
    >
      <button
        onClick={() => toggle(index)}
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
        />
      </button>

      <AnimatePresence initial={false}>
        {openIndex === index && (
          <motion.div
            initial={false}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col px-6 pb-4 bg-white text-amber-900"
          >
            <p className="text-sm sm:text-base md:text-lg mb-3 sm:mb-4">
              {faq.answer}
            </p>

            {faq.images && (
              <div
                ref={imageRef}
                className="flex flex-row-reverse gap-2 mr-4 sm:mr-12 md:mr-24 lg:mr-48"
              >
                {faq.images.map((img, i) => (
                  <div
                    key={i}
                    className="overflow-hidden image-item hover:scale-110 transition-transform duration-200"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      className="w-16 sm:w-4 md:w-8 lg:w-12 h-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageAction;
*/
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { FAQItem } from "../data/faq";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

interface ImageProps {
  index: number;
  openIndex: number | null;
  setOpenIndex: (value: number | null) => void;
  faq: FAQItem;
}

const ImageAction = ({ index, openIndex, setOpenIndex, faq }: ImageProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Toggle: if closed → open by setting openIndex.
  // If already open → reverse timeline (and wait for onReverseComplete to clear openIndex).
  const toggle = () => {
    const isOpen = openIndex === index;
    if (isOpen) {
      // play reverse — do NOT setOpenIndex(null) here, wait for onReverseComplete
      tlRef.current?.reverse();
    } else {
      setOpenIndex(index);
    }
  };

  // Create / play timeline only when the content is mounted (openIndex === index)
  useLayoutEffect(() => {
    // only create timeline when this panel is opened and DOM exists
    if (openIndex !== index || !wrapperRef.current) return;

    const container = wrapperRef.current;
    const items = container.querySelectorAll<HTMLElement>(".image-item");

    // Kill previous if any (safety)
    tlRef.current?.kill();

    // Create a timeline that plays forward (open) and reverses for close.
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.out" },
      onReverseComplete: () => {
        // after reverse finishes, unmount the panel by clearing openIndex
        setOpenIndex(null);
      },
    });

    // root container animation (subtle)
    tl.fromTo(
      container,
      { opacity: 0, x: -120, y: 10, rotate: -6 },
      { opacity: 1, x: 0, y: 0, rotate: 0, duration: 0.45 }
    );

    // stagger images in
    if (items.length) {
      tl.from(
        items,
        {
          opacity: 0,
          x: -80,
          rotate: -30,
          duration: 0.48,
          stagger: 0.09,
        },
        "-=0.28"
      );
    }

    // small subtle final settle (optional)
    tl.to(container, { duration: 0.12, ease: "power1.out" }, "+=0");

    // save timeline & play (open)
    tlRef.current = tl;
    tl.play();

    // cleanup when this panel unmounts
    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, [openIndex, index, setOpenIndex]);

  return (
    <div
      className="
        border border-amber-100/70 rounded-2xl overflow-hidden shadow-md
        bg-amber-700/40 backdrop-blur-sm
      "
    >
      <button
        onClick={toggle}
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
          className={`transition-transform w-8 sm:w-10 md:w-12 ${
            openIndex === index ? "rotate-180 duration-300" : ""
          }`}
          src="/images/faq/barcelona_pavement_style.png"
          alt="Barcelona's Pavement"
          width={48}
          height={48}
        />
      </button>

      <AnimatePresence initial={false}>
        {openIndex === index && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col px-6 pb-4 bg-white text-amber-900"
          >
            <p className="text-sm sm:text-base md:text-lg mb-3 sm:mb-4">
              {faq.answer}
            </p>

            {faq.images && (
              <div
                ref={wrapperRef}
                className="flex flex-row-reverse gap-2 mr-4 sm:mr-12 md:mr-24 lg:mr-24"
              >
                {faq.images.map((img, i) => (
                  <div
                    key={i}
                    className="image-item overflow-hidden"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      className="w-16 sm:w-4 md:w-8 lg:w-12 h-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageAction;
