/*"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

const AnimatedHeader = () => {
  const titleRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
    const wrapper = wrapperRef.current;
    const image = titleRef.current;
    if (!wrapper || !image) return;

    // 🎬 Initial fade-in animation on scroll
    gsap.fromTo(
      wrapper,
      { opacity: 0, scale: 0.7, y: 40 },
      {
        opacity: 1,
        scale: 1,
        y: 40,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrapper,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // 🌀 Smooth shrink & expand animation when scrolling
    const shrink = gsap.to(wrapper, {
      scale: 0.55,
      opacity: 0.9,
      y: 40,
      duration: 0.8,
      ease: "power2.out",
      transformOrigin: "top center",
      paused: true,
    });

    const fadeRotate = gsap.to(image, {
      rotate: -2,
      opacity: 0.95,
      duration: 0.8,
      ease: "power2.out",
      paused: true,
    });

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top+=50",
      end: "+=250",
      scrub: 1.2, 
      pin: true,
      pinSpacing: false,
      onUpdate: (self) => {
        shrink.progress(self.progress);
        fadeRotate.progress(self.progress);
      },
      onEnter: () => {
        gsap.set(wrapper, { position: "fixed", top: "10px", zIndex: 50 });
      },
      onLeaveBack: () => {
        gsap.set(wrapper, { position: "relative", top: "auto", zIndex: 1 });
      },
    });

    return () => {
      trigger.kill();
      gsap.killTweensOf([wrapper, image]);
    };
  }, []);
  
  return (
    <div ref={wrapperRef} className="w-screen fixed flex justify-center z-30">
      <img
        ref={titleRef} 
        src="/images/coctails_header.webp"
        alt="Tour Header"
        width={914}
        height={315}
      />
    </div>
  );
};

export default AnimatedHeader;
*/
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AnimatedHeader = () => {
  const titleRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const image = titleRef.current;
    if (!wrapper || !image) return;

    // ✅ Kill old triggers if any
    ScrollTrigger.getAll().forEach((t) => t.kill());

    // 🎬 Initial fade-in animation
    gsap.fromTo(
      wrapper,
      { opacity: 0, y: 60, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrapper,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // 🌀 Scroll-based shrink animation — only desktop/tablet
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const shrink = gsap.to(wrapper, {
        scale: 0.6,
        opacity: 0.9,
        y: 40,
        ease: "power2.out",
        paused: true,
      });

      const fadeRotate = gsap.to(image, {
        rotate: -2,
        opacity: 0.95,
        ease: "power2.out",
        paused: true,
      });

      const trigger = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top+=50",
        end: "+=250",
        scrub: 1.2,
        pin: true,
        pinSpacing: false,
        onUpdate: (self) => {
          shrink.progress(self.progress);
          fadeRotate.progress(self.progress);
        },
        onEnter: () => {
          gsap.set(wrapper, { position: "fixed", top: "10px", zIndex: 50 });
        },
        onLeaveBack: () => {
          gsap.set(wrapper, { position: "relative", top: "auto", zIndex: 1 });
        },
      });

      return () => trigger.kill();
    });

    // ✅ Refresh on resize/orientation change
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);
    window.addEventListener("orientationchange", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", refresh);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.killTweensOf([wrapper, image]);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="fixed top-0 left-0 w-full flex justify-center z-30 pointer-events-none"
    >
      <img
        ref={titleRef}
        src="/images/coctails_header.webp"
        alt="Tour Header"
        className="
          w-[90%] max-w-[600px] sm:max-w-[720px] md:max-w-[900px] 
          h-auto object-contain mt-4 sm:mt-6
        "
        loading="eager"
      />
    </div>
  );
};

export default AnimatedHeader;
