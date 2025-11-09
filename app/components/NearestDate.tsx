"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import BookingPopupContainer from "./booking_form/BookingPopupContainer";


type SlotRow = {
  id: number;
  slot_date: string; 
  slot_hour: string; 
  capacity_left: number;
  capacity_total?: number;
};

type Props = {
  onQuickBook?: (slot: SlotRow) => void;
  refreshInterval?: number | null;
};

const NearestDate = ({ onQuickBook, refreshInterval = 0 }: Props) => {
  const supabase = createClient();
  const calendarRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [slots, setSlots] = useState<SlotRow[] | null>(null);
  const [closest, setClosest] = useState<SlotRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false)


  const fetchSlots = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("slots")
          .select("id, slot_date, slot_hour, capacity_left, capacity_total")
          .gte("slot_date", new Date().toISOString().slice(0, 10)) 
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

    console.log(slots);

  useEffect(() => {
    if (!slots) {
      setClosest(null);
      return;
    }
    const now = Date.now();

    const withTs = slots
      .map((s) => {
        const hhmm = s.slot_hour.split(":").slice(0, 2).join(":");
        const iso = `${s.slot_date}T${hhmm}:00`;
        const ts = Date.parse(iso);
        return { slot: s, ts };
      })
      .filter((x) => !Number.isNaN(x.ts))
      .filter((x) => x.ts >= now);

    if (withTs.length === 0) {
      setClosest(null);
      return;
    }

    withTs.sort((a, b) => a.ts - b.ts);
    setClosest(withTs[0].slot);
  }, [slots]);
  console.log("Closest:", closest)
  

  useEffect(() => {
      fetchSlots();
      if (refreshInterval && refreshInterval > 0) {
        const id = setInterval(fetchSlots, refreshInterval);
        return () => clearInterval(id);
      }
    }, [fetchSlots, refreshInterval]);

  
  useEffect(() => {
    const el = calendarRef.current;
    if (!el) return;

    const xCoords = [400, 200,  0, -200, -400];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: "power1.inOut" },
      });

      xCoords.forEach((x) => {
        tl.fromTo(
          el, 
          { 
            y: "120vh", 
            x, 
            opacity: 1, 
            force3D: true 
          },
          {
            y: "-120vh",
            x,
            duration: 12,
            force3D: true,
          },
          "+=0.3"
        );
      });

      tlRef.current = tl;
    }, calendarRef);

    return () => ctx.revert();
  }, []);


  const prettySlotLabel = (s: SlotRow | null) => {
    if (!s) return "No upcoming tours";
    const hhmm = s.slot_hour.split(":").slice(0, 2).join(":");
    const [y, m, d] = s.slot_date.split("-");
    return `${hhmm} ${d}.${m}.${y.slice(2)}`;
  };

  const handleQuickBook = () => {
    if (!closest) return;
    onQuickBook?.(closest);
    setShowPopup(true);
  };
  
  const handleMouseEnter = () => {
    if (tlRef.current) {
      tlRef.current.pause();
      console.log("🟡 Animation paused");
    }
  };

  const handleMouseLeave = () => {
    if (tlRef.current) {
      tlRef.current.resume();
      console.log("🟢 Animation resumed");
    }
  };
 
  return (
    <>
      {showPopup && (
        <div>
          <BookingPopupContainer 
            isOpen={showPopup} 
            specifiedDate={closest?.slot_date} 
            mode={"create"} 
            selectedHour={closest?.slot_hour}
            onClose={() => setShowPopup(false)}
          />
        </div>
      )}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 pointer-events-auto z-10"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={calendarRef}
          className="flex flex-col mx-auto my-6 max-w-xl bg-amber-600/80 text-white rounded-2xl px-6 py-4 shadow-xl items-center gap-6 justify-between"
          style={{
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          <Image
            className="absolute bottom-44"
            src="/images/baloons.png"
            alt="Beautiful colorful baloons"
            width={258}
            height={360}
          />

          {/* Your content */}
          <div className="flex items-center gap-4">
            <div className="bg-white/10 rounded-lg px-3 py-2 text-center">
              <div className="text-sm">Next tour</div>
              <div className="text-2xl font-bold">{prettySlotLabel(closest)}</div>
              <div className="text-xs mt-1 opacity-80">
                {loading ? "loading…" : error ? error : closest ? `${closest.capacity_left} places left` : "No slots"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex-col text-right mr-4">
              <div className="text-sm opacity-80">Available</div>
              {closest ?
              <div className={closest.capacity_left > 3 ? `flex text-xl font-semibold justify-center`: `bg-amber-100/75 border-amber-200 flex text-xl font-semibold justify-center rounded-md text-red-400`}>
                {closest ? closest.capacity_left : "--" }
              </div>
            : ''}
            </div>

            <button
              onClick={handleQuickBook}
              className="bg-amber-400 border-2 border-amber-900 hover:bg-amber-300 text-amber-900 font-semibold px-5 py-2 rounded-lg shadow-md"
              aria-disabled={!closest}
            >
              Quick Book
            </button>
          </div>
        </div>
      </div>
    </>
     
  );
};

export default NearestDate;
