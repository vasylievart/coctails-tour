// components/UpcomingSlotBanner.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
//import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // if you use helpers
// or: import { supabase } from "@/lib/supabase-client";  // your client import
import { supabase } from "@/lib/supabase-client";
import { gsap } from "gsap";
//import { v4 as uuidv4 } from "uuid";

type SlotRow = {
  id: number;
  slot_date: string; // 'YYYY-MM-DD'
  slot_hour: string; // 'HH:MM:SS' or 'HH:MM'
  capacity_left: number;
  capacity_total?: number;
};

type Props = {
  // callback when user clicks Quick Book
  onQuickBook?: (slot: SlotRow) => void;
  // optional: poll interval to refresh slots (ms)
  refreshInterval?: number | null;
};

export default function UpcomingSlotBanner({ onQuickBook, refreshInterval = 0 }: Props) {
  const [slots, setSlots] = useState<SlotRow[] | null>(null);
  const [closest, setClosest] = useState<SlotRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bannerRef = useRef<HTMLDivElement | null>(null);
  const balloonsRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // fetch slots from Supabase (future slots with capacity > 0)
  const fetchSlots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // adjust select fields to what's in your table
      const { data, error } = await supabase
        .from("slots")
        .select("id, slot_date, slot_hour, capacity_left, capacity_total")
        .gte("slot_date", new Date().toISOString().slice(0, 10)) // fetch today and future
        .order("slot_date", { ascending: true })
        .order("slot_hour", { ascending: true });

      if (error) throw error;
      setSlots(data ?? []);
    } catch (err: any) {
      console.error("Error fetching slots:", err);
      setError(err?.message || "Failed to load slots");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // pick the nearest future slot comparing date+time to now
  useEffect(() => {
    if (!slots) {
      setClosest(null);
      return;
    }
    const now = Date.now();

    // map slots to Date objects
    const withTs = slots
      .map((s) => {
        // normalize hour (could be "HH:MM" or "HH:MM:SS")
        const hhmm = s.slot_hour.split(":").slice(0, 2).join(":");
        const iso = `${s.slot_date}T${hhmm}:00`; // 'YYYY-MM-DDTHH:MM:00'
        const ts = Date.parse(iso);
        return { slot: s, ts };
      })
      .filter((x) => !Number.isNaN(x.ts))
      .filter((x) => x.ts >= now); // future or now

    if (withTs.length === 0) {
      setClosest(null);
      return;
    }

    // pick minimum ts
    withTs.sort((a, b) => a.ts - b.ts);
    setClosest(withTs[0].slot);
  }, [slots]);

  // initial fetch and optional polling
  useEffect(() => {
    fetchSlots();
    if (refreshInterval && refreshInterval > 0) {
      const id = setInterval(fetchSlots, refreshInterval);
      return () => clearInterval(id);
    }
    // no cleanup needed if no polling
  }, [fetchSlots, refreshInterval]);

  // GSAP balloons animation setup (only once)
  useEffect(() => {
    const banner = bannerRef.current;
    const balloons = balloonsRef.current;
    if (!banner || !balloons) return;

    // create a simple timeline that:
    // - moves each balloon upward continuously
    // - shifts whole balloon container horizontally in steps and loops
    const t = gsap.timeline({ repeat: -1 });
    tlRef.current = t;

    // create per-balloon float animations (vertical)
    const balloonEls = Array.from(balloons.children) as HTMLElement[];

    balloonEls.forEach((el, idx) => {
      // randomize speed & delay a bit
      const dur = 9 + Math.random() * 6;
      const delay = Math.random() * 3;
      // from below banner bottom to above banner top
      gsap.fromTo(
        el,
        { y: banner.offsetHeight + (Math.random() * 80), opacity: 0 },
        {
          y: -200 - Math.random() * 120,
          opacity: 1,
          duration: dur,
          ease: "linear",
          repeat: -1,
          delay,
        }
      );
    });

    // horizontal sweeping (container small shifts)
    const sweepDistance = banner.offsetWidth * 0.6; // how far to travel horizontally
    t.to(balloons, { x: 0, duration: 0.001 }); // ensure initial
    // step-based sweeps: right -> left in 3 steps with small pause
    t.to(balloons, { x: banner.offsetWidth * 0.08, duration: 3, ease: "power1.inOut" });
    t.to(balloons, { x: banner.offsetWidth * 0.32, duration: 3, ease: "power1.inOut", delay: 0.5 });
    t.to(balloons, { x: banner.offsetWidth * 0.64, duration: 4, ease: "power1.inOut", delay: 0.5 });
    t.to(balloons, { x: -banner.offsetWidth * 0.08, duration: 4, ease: "power1.inOut", delay: 0.7 });
    // short pause then loop
    t.to(balloons, { x: 0, duration: 1, ease: "power1.inOut", delay: 0.5 });

    // cleanup
    return () => {
      t.kill();
      balloonEls.forEach((el) => gsap.killTweensOf(el));
      tlRef.current = null;
    };
  }, []); // run once

  // helper to format
  const prettySlotLabel = (s: SlotRow | null) => {
    if (!s) return "No upcoming tours";
    // normalize hour like "18:00" (remove seconds)
    const hhmm = s.slot_hour.split(":").slice(0, 2).join(":");
    // dd.MM.yy
    const [y, m, d] = s.slot_date.split("-");
    return `${hhmm} ${d}.${m}.${y.slice(2)}`;
  };

  const handleQuickBook = () => {
    if (!closest) return;
    onQuickBook?.(closest);
  };

  // small balloon elements (you can customize count and images)
  const balloonCount = 6;
  const balloonNodes = Array.from({ length: balloonCount }).map((_, i) => (
    <div
      key={i}
      className="absolute pointer-events-none"
      style={{
        left: `${10 + i * (80 / balloonCount)}%`,
        width: 72,
        height: 72,
        transform: `translateY(0) scale(${0.9 + Math.random() * 0.3}) rotate(${(Math.random() - 0.5) * 30}deg)`,
        filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.15))",
      }}
    >
      {/* replace with your image or inline svg */}
      <img
        src="/images/balloon.svg"
        alt="balloon"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  ));

  return (
    <div className="relative w-full overflow-hidden pointer-events-none">
      {/* banner container */}
      <div
        ref={bannerRef}
        className="mx-auto my-6 max-w-5xl bg-amber-900/85 text-white rounded-2xl px-6 py-4 shadow-xl flex items-center gap-6 justify-between"
        style={{ pointerEvents: "auto" }}
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/10 rounded-lg px-3 py-2 text-center">
            <div className="text-sm">Next tour</div>
            <div className="text-2xl font-bold">{prettySlotLabel(closest)}</div>
            <div className="text-xs mt-1 opacity-80">
              {loading ? "loading…" : error ? error : closest ? `${closest.capacity_left} places left` : "No slots"}
            </div>
          </div>

          <div className="hidden sm:block">
            {/* decorative — clock/calendar icon or custom */}
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className="opacity-95">
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.2" />
              <path d="M12 7v6l4 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right mr-4">
            <div className="text-sm opacity-80">Available</div>
            <div className="text-xl font-semibold">{closest ? closest.capacity_left : "--"}</div>
          </div>

          <button
            onClick={handleQuickBook}
            className="bg-amber-400 hover:bg-amber-300 text-black font-semibold px-5 py-2 rounded-lg shadow-md"
            aria-disabled={!closest}
          >
            Quick Book
          </button>
        </div>
      </div>

      {/* balloons container – absolutely positioned so GSAP can animate freely */}
      <div
        ref={balloonsRef}
        className="absolute inset-x-0 -bottom-8 h-64 pointer-events-none"
        style={{ willChange: "transform" }}
      >
        {balloonNodes}
      </div>
    </div>
  );
}
