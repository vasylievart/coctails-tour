"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParallaxFrame from "./ParallaxFrame";

gsap.registerPlugin(ScrollTrigger);

const Main = () => {
  const streetOneRef = useRef<HTMLImageElement>(null);
  const streetTwoRef = useRef<HTMLImageElement>(null);
  const coctailOneRef = useRef<HTMLImageElement>(null);
  const coctailTwoRef = useRef<HTMLImageElement>(null);
  const coctailThreeRef = useRef<HTMLImageElement>(null);
  const coctailFourRef = useRef<HTMLImageElement>(null);
  const coctailFiveRef = useRef<HTMLImageElement>(null);
  const coctailSixRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const escudoRef = useRef<HTMLImageElement>(null);
  const panConTomateRef = useRef<HTMLImageElement>(null);
  const postMarkOneRef = useRef<HTMLImageElement>(null);
  const postMarkTwoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const elements = [
      { ref: streetOneRef, from: { y: 200, rotate: -90}, to: { y: 0, rotate: 12 } },
      { ref: streetTwoRef, from: { y: 240, rotate: -60 }, to: { y: 0, rotate: 6} },
      { ref: coctailOneRef, from: { y: 264, rotate: -30}, to: { y: 0, rotate: 12} },
      { ref: coctailTwoRef, from: { y: 272, rotate: -35 }, to: { y: 0, rotate: 6 } },
      { ref: coctailThreeRef, from: { y: 296, rotate: -35 }, to: { y: 0, rotate: 6 } },
      { ref: coctailFourRef, from: { y: 300, rotate: -35 }, to: { y: 0, rotate: 6 } },
      { ref: coctailFiveRef, from: { y: 320, rotate: -35 }, to: { y: 0, rotate: 6 } },
      { ref: coctailSixRef, from: { y: 364, rotate: -35 }, to: { y: 0, rotate: 6 } },
      { ref: frameRef, from: { y: 500, rotate: -15 }, to: { y: 0, rotate: 3 } },
      { ref: photoRef, from: { y: 500}, to: { y: 0, rotate: 3 }},
      { ref: escudoRef, from: {y: 372, rotate: -35}, to: {y: 0, rotate: -6}},
      { ref: panConTomateRef, from: {y: 396, rotate: -35}, to: {y: 0, rotate: 9}},
      { ref: postMarkOneRef, from: {y: 400, rotate: -35}, to: {y:0, rotate: -12}}
    ];

    elements.forEach(({ ref, from, to }) => {
      if (!ref.current) return;

      gsap.fromTo(
        ref.current,
        from,
        {
          ...to,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,     
            start: "top 90%",         
            toggleActions: "play none none reverse", 
          },
        }
      );
    });

    // Cleanup: kill triggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // --- JSX ---
  return (
    <div className="relative min-h-[200vh] w-full overflow-visible">
      <section className="relative h-screen flex justify-center items-center">
        <Image 
          ref={streetOneRef} 
          //className="absolute top-[20%] right-[8%] max-w-[240px] z-20"
          className="
            absolute top-[20%] right-[8%] 
            max-w-[160px]      /* mobile default */
            sm:max-w-[200px]   /* ≥640px */
            md:max-w-[240px]   /* ≥768px */
            lg:max-w-[280px]   /* ≥1024px */
            xl:max-w-[320px]   /* ≥1280px */
            z-20
          "
          src="/images/barcelona_street_1.webp" 
          loading="lazy" 
          width={665} 
          height={900} 
          alt="Street of Barcelona, Born" 
        />
        <Image 
          ref={streetTwoRef}  
          //className="absolute top-[40%] left-[12%] max-w-[300px] z-20"
          className="
            absolute top-[40%] left-[12%] 
            max-w-[200px]      /* mobile default */
            sm:max-w-[240px]   /* ≥640px */
            md:max-w-[300px]   /* ≥768px */
            lg:max-w-[320px]   /* ≥1024px */
            xl:max-w-[396px]   /* ≥1280px */
            z-20"
          src="/images/barcelona_street_2.webp" 
          loading="lazy" 
          width={665} 
          height={900} 
          alt="Street of Barcelona, Born" 
        />
      </section>
      <ParallaxFrame/>
      <section className="relative h-screen flex justify-center items-center">
        <Image 
          ref={coctailOneRef} 
          //className="absolute top-[6%] left-[3%]  max-w-[160px]"
          className="
            absolute top-[6%] left-[3%] 
            max-w-[120px]      /* mobile default */
            sm:max-w-[144px]   /* ≥640px */
            md:max-w-[160px]   /* ≥768px */
            lg:max-w-[172px]   /* ≥1024px */
            xl:max-w-[200px]   /* ≥1280px */
            z-20"
          src="/images/coctail_1.png" 
          loading="lazy" 
          width={191} 
          height={305} 
          alt="Coctail" 
        />
        <Image 
          ref={coctailTwoRef} 
          //className="absolute top-[8%] right-[8%] max-w-[240px]  z-20" 
          className="
            absolute top-[8%] right-[8%] 
            max-w-[160px]      /* mobile default */
            sm:max-w-[200px]   /* ≥640px */
            md:max-w-[240px]   /* ≥768px */
            lg:max-w-[280px]   /* ≥1024px */
            xl:max-w-[320px]   /* ≥1280px */
            z-20"
          src="/images/coctail_2.png" 
          loading="lazy" 
          width={368} 
          height={602} 
          alt="Coctail" 
        />
        <Image 
          ref={coctailThreeRef} 
          //className="absolute top-[24%] left-[24%] max-w-[240px]  z-20" 
          className="
            absolute top-[24%] left-[24%] 
            max-w-[160px]      /* mobile default */
            sm:max-w-[200px]   /* ≥640px */
            md:max-w-[240px]   /* ≥768px */
            lg:max-w-[280px]   /* ≥1024px */
            xl:max-w-[300px]   /* ≥1280px */
            z-20"
          src="/images/coctail_3.png" 
          loading="lazy" 
          width={313} 
          height={387} 
          alt="Coctail" 
        />
        <Image 
          ref={coctailFourRef}  
          //className="absolute top-[32%] right-[24%] max-w-[240px]  z-20" 
          className="
            absolute top-[32%] right-[24%] 
            max-w-[160px]      /* mobile default */
            sm:max-w-[200px]   /* ≥640px */
            md:max-w-[240px]   /* ≥768px */
            lg:max-w-[280px]   /* ≥1024px */
            xl:max-w-[320px]   /* ≥1280px */
            z-20"
          src="/images/coctail_4.png"
          loading="lazy" 
          width={223} 
          height={261} 
          alt="Coctail" />
        <Image 
          ref={coctailFiveRef} 
          //className="absolute top-[64%] left-[18%] max-w-[240px]  z-20" 
          className="
            absolute top-[64%] left-[18%] 
            max-w-[160px]      /* mobile default */
            sm:max-w-[200px]   /* ≥640px */
            md:max-w-[240px]   /* ≥768px */
            lg:max-w-[280px]   /* ≥1024px */
            xl:max-w-[320px]   /* ≥1280px */
            z-20"
          src="/images/coctail_5.png" 
          loading="lazy" 
          width={364} 
          height={485} 
          alt="Coctail" />
        <Image 
          ref={coctailSixRef} 
          //className="absolute top-[72%] right-[38%] max-w-[240px]  z-20" 
          className="
            absolute top-[72%] right-[38%] 
            max-w-[160px]      /* mobile default */
            sm:max-w-[200px]   /* ≥640px */
            md:max-w-[240px]   /* ≥768px */
            lg:max-w-[280px]   /* ≥1024px */
            xl:max-w-[320px]   /* ≥1280px */
            z-20"
          src="/images/coctail_6.png" 
          loading="lazy" 
          width={372} 
          height={581} 
          alt="Coctail" />
      </section>
      <section className="relative h-screen flex justify-center items-center">
        <Image 
          ref={escudoRef} 
          //className="absolute top-[12%] right-[16%] max-w-[180px]  z-20" 
          className="
            absolute top-[12%] right-[16%] 
            max-w-[120px]      /* mobile default */
            sm:max-w-[144px]   /* ≥640px */
            md:max-w-[180px]   /* ≥768px */
            lg:max-w-[200px]   /* ≥1024px */
            xl:max-w-[240px]   /* ≥1280px */
            z-20"
          src="/images/escudo_barcelona.png" 
          loading="lazy" 
          width={163} 
          height={194} 
          alt="Coat of Arms of Barcelona" />
        <Image 
          ref={panConTomateRef} 
          //className="absolute top-[22%] left-[20%] max-w-[180px]  z-20" 
          className="
            absolute top-[22%] left-[20%] 
            max-w-[120px]      /* mobile default */
            sm:max-w-[144px]   /* ≥640px */
            md:max-w-[180px]   /* ≥768px */
            lg:max-w-[200px]   /* ≥1024px */
            xl:max-w-[240px]   /* ≥1280px */
            z-20"
          src="/images/pan_con_tomate.webp" 
          loading="lazy" 
          width={665} 
          height={900} 
          alt="Pan con tomate" />
        <Image 
          ref={postMarkOneRef} 
          //className="absolute top-[36%] right-[36%] max-w-[180px]  z-20" 
          className="
            absolute top-[36%] right-[36%] 
            max-w-[120px]      /* mobile default */
            sm:max-w-[144px]   /* ≥640px */
            md:max-w-[180px]   /* ≥768px */
            lg:max-w-[200px]   /* ≥1024px */
            xl:max-w-[240px]   /* ≥1280px */
            z-20"
          src="/images/postmark_1.png" 
          loading="lazy" 
          width={163} 
          height={250} 
          alt="Postmark Catalonia" />
        <Image 
        ref={postMarkTwoRef} 
        //className="absolute top-[32%] left-[4%] max-w-[180px]  z-20" 
        className="
            absolute top-[32%] left-[4%] 
            max-w-[120px]      /* mobile default */
            sm:max-w-[144px]   /* ≥640px */
            md:max-w-[180px]   /* ≥768px */
            lg:max-w-[200px]   /* ≥1024px */
            xl:max-w-[240px]   /* ≥1280px */
            z-20"
        src="/images/postmark_2.png" 
        loading="lazy" 
        width={400} 
        height={480} 
        alt="Postmark Catalonia" />
      </section>
    </div>
  );
};

export default Main;
