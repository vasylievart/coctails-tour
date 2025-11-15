"use client";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxFrame() {
  const frameRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const photo = photoRef.current;
    if (!frame || !photo) return;

    const ctx = gsap.context(() => {
      // 🎞️ Animate frame itself (rotate + slight vertical move)
      gsap.to(frame, {
        y: -150,
        rotate: -4,
        ease: "none",
        scrollTrigger: {
          trigger: frame,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // 🏞️ Animate inner photo — moves *inside* the frame
      gsap.to(photo, {
        yPercent: -25, // moves the landscape photo up (revealing more)
        ease: "none",
        scrollTrigger: {
          trigger: frame,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    frame.addEventListener("mousemove", (e) => {
      const { width, height, left, top } = frame.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      gsap.to(frame, { rotateY: x * 10, rotateX: -y * 10, duration: 0.6 });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={frameRef}
      //className="relative w-4/5 md:w-2/3 xl:w-1/2 mx-auto rotate-3 overflow-hidden"
      className="
        relative mx-auto rotate-2 sm:rotate-3 overflow-hidden
        w-[95%] sm:w-4/5 md:w-2/3 lg:w-1/2 
        max-w-[665px]
      "
    >
      {/* 🖼️ Frame image */}
      <Image
        src="/images/frame.webp"
        alt="Picture frame"
        decoding="async"
        width={665}
        height={900}
        className="relative w-full z-10"
        sizes="
          (max-width: 640px) 90vw,
          (max-width: 1024px) 60vw,
          (max-width: 1280px) 45vw,
          665px
        "
      />
      <div 
      //className="absolute top-12 bottom-3.5 left-12 right-2.5 rounded-xl overflow-hidden xl:bottom-4.5 xl:right-3.5 2xl:bottom-5.5 2xl:right-4.5 max-w-[665px]"
        className="
            absolute top-[6%] bottom-[3%] left-[8%] right-[3%]
            rounded-xl overflow-hidden
          "
      >
        <Image
          ref={photoRef}
          src="/images/landscape_barcelona.webp"
          alt="Landscape"
          width={665}
          height={998}
          className="w-full object-cover"
          sizes="
            (max-width: 640px) 85vw,
            (max-width: 1024px) 55vw,
            (max-width: 1280px) 40vw,
            665px
          "

        />
      </div>
    </div>
  );
}
