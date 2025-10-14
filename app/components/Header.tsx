"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AnimatedHeader = () => {
  const titleRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    // ✅ Animate when element first appears
    gsap.fromTo(
      el,
      {
        opacity: 0,
        scale: 0.5,
        rotate: 5,
        transformOrigin: "center",
      },
      {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // ✅ Smooth shrink + sticky header effect
    const ctx = gsap.context(() => {
      const shrink = gsap.to(el, {
        scale: 0.5,
        opacity: 0.9,
        y: -40, // move slightly up instead of switching to fixed
        duration: 0.5,
        ease: "power2.out",
        paused: true,
      });

      ScrollTrigger.create({
        trigger: el,
        start: "top top+=50", // start shrinking slightly before reaching top
        end: "+=200",
        scrub: true,
        pin: true,
        pinSpacing: false,
        onUpdate: (self) => {
          shrink.progress(self.progress);
        },
        onEnter: () => {
      
          gsap.set(el, { position: "sticky", top: "10px", zIndex: 50});
        },
        onLeaveBack: () => {
          // restore to normal flow
          gsap.set(el, { position: "relative", top: "auto", zIndex: 1 });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed flex justify-center py-10 z-30">
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
