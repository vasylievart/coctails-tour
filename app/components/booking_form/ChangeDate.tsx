"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useBookingState } from "./hooks/useBookingState";
import { Booking } from "@/app/utils/types";

interface ChangeDateProps {
  rowDate: string | undefined;
  bookingDate?: Booking;
  mode?: "create" | "edit";
}

const ChangeDate = ({ rowDate, bookingDate, mode }: ChangeDateProps) => {
  // ✅ Initial value setup with safe fallback
  const initialTemp = mode === "edit" ? bookingDate?.booking_date ?? rowDate : rowDate;

  const { setDay, setMonth, setYear } = useBookingState();

  const [tempDate, setTempDate] = useState<string |undefined>(initialTemp);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    tempDate ? new Date(tempDate) : undefined
  );

  const calendarRef = useRef<HTMLDivElement>(null);

  // ✅ Handle outside click (mobile-friendly)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showCalendar]);

  // ✅ Handle date selection
  const handleCalendarSelect = (newDate: Date | undefined) => {
    if (!newDate) return;

    const d = newDate.getDate();
    const m = newDate.getMonth();
    const y = newDate.getFullYear();

    setSelectedDate(newDate);
    setTempDate(format(newDate, "yyyy-MM-dd"));
    setDay(d);
    setMonth(m);
    setYear(y);
    setShowCalendar(false);
  };

  return (
    <div className="relative flex justify-between items-center w-full text-lg sm:text-base">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
        <div className="flex justify-between w-full items-center">
          <span className="font-medium text-white/90">Date:</span>
          <span className="text-white/80">{tempDate}</span>
          <CalendarIcon
            size={20}
            className="cursor-pointer text-white/75 hover:text-amber-100 ml-2 sm:ml-4"
            onClick={() => setShowCalendar(!showCalendar)}
          />
        </div>
      </div>

      {showCalendar && (
        <div
          ref={calendarRef}
          className="absolute top-12 sm:top-10 left-1/2 -translate-x-1/2 bg-amber-900/90 border border-white/30 rounded-2xl shadow-xl p-2 sm:p-4 w-[95vw] max-w-sm z-50"
        >
          <DayPicker
            mode="single"
            disabled={{ before: new Date() }}
            selected={selectedDate}
            onSelect={handleCalendarSelect}
            className="text-base sm:text-lg"
            classNames={{
              today: "bg-amber-700/60",
              selected: "bg-amber-500/80 text-white rounded-full",
              chevron: "fill-white",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ChangeDate;
