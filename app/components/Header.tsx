"use client";

import {useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const AnimatedHeader = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLImageElement>(null);
  const hasInit = useRef(false);

  useLayoutEffect(() => {
    if (hasInit.current) return;
    hasInit.current = true;

    const wrapper = wrapperRef.current;
    const image = titleRef.current;
    if (!wrapper || !image) return;

    // Clear all previous triggers (safe at mount)
    ScrollTrigger.killAll();

    // Initial fade-in
    gsap.from(wrapper, {
      opacity: 0,
      y: 50,
      duration: 1.6,
      ease: "power2.out",
    });

    // MATCHMEDIA — only desktop
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "+=250",
          scrub: 1.2,
          pin: false,
          anticipatePin: 1,
        },
      });

      tl.to(wrapper, { scale: 0.6, opacity: 0.9, y: 50, ease: "power2.out" })
        .to(image, {  opacity: 0.93, ease: "power2.out" }, "<");

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    // Debounced refresh
    let timeout: ReturnType<typeof setTimeout>;
    const refresh = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => ScrollTrigger.refresh(), 500);
    };

    window.addEventListener("resize", refresh);
    window.addEventListener("orientationchange", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", refresh);
      ScrollTrigger.killAll();
      gsap.killTweensOf(wrapper);
      gsap.killTweensOf(image);
      mm.kill();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="fixed top-0 left-0 w-full flex justify-center z-10 pointer-events-none"
    >
      <Image
        ref={titleRef}
        src="/images/coctails_header.webp"
        alt="Tour Header"
        width={914}
        height={315}
        loading="eager"
        className="
          w-[90%] max-w-[600px] sm:max-w-[720px] md:max-w-[900px]
          h-auto object-contain mt-4 sm:mt-6
        "
        priority
      />
    </div>
  );
};

export default AnimatedHeader;

