"use client";

import { useState } from "react";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon, Pen } from "lucide-react";
import { Chevron, DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { IMaskInput } from "react-imask";
import { Calendar } from "@/components/ui/calendar";




export default function EditableDatePicker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isEditable, setIsEditable] = useState(false);
  const [tempDate, setTempDate] = useState(format(selectedDate, "dd.MM.yyyy"));
  const [showCalendar, setShowCalendar] = useState(false);
  const defaultClassNames = getDefaultClassNames();

  // Convert typed date string -> Date object
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempDate(e.target.value);
  };

  // Handle "Enter" key to confirm date
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const parsed = parse(tempDate, "dd.MM.yyyy", new Date());
      if (!isNaN(parsed.getTime())) {
        setSelectedDate(parsed);
        setIsEditable(false);
        setShowCalendar(false);
      } else {
        alert("Please enter a valid date (DD.MM.YYYY)");
      }
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setTempDate(format(date, "dd.MM.yyyy"));
    setShowCalendar(false);
    setIsEditable(false);
  };

  return (
    <div className="flex flex-col gap-2 relative">
      {isEditable ? (
        <div className="relative">
          {/* Text input with mask */}
          <IMaskInput
            mask="99.99.9999"
            value={tempDate}
            onChange={handleDateInput}
            onKeyDown={handleKeyDown}
            placeholder="DD.MM.YYYY"
            className="w-full border-2 p-2 rounded-lg focus:ring-2 focus:ring-amber-400 text-lg"
          />

          {/* Calendar icon button */}
          <CalendarIcon
            size={20}
            className="absolute right-3 top-3 text-white cursor-pointer hover:text-amber-100"
            onClick={() => setShowCalendar(!showCalendar)}
          />

          {showCalendar && (
            <div className="absolute bg-amber-900/80 border-2 text-2xl text-white p-4 rounded-xl shadow-sm " >
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleCalendarSelect}
                classNames={{
                  today: `border-white`, 
                  selected: `bg-amber-500/80  text-white rounded-full`, 
                  root: `${defaultClassNames.root} shadow-lg p-5`, 
                  chevron: `${defaultClassNames.chevron} fill-white` 
                }}
              />*
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <span>Date:</span>
          <span className="font-medium">{format(selectedDate, "dd.MM.yyyy")}</span>
          <Pen
            onClick={() => {
              setIsEditable(true);
              setTempDate(format(selectedDate, "dd.MM.yyyy"));
            }}
            size={16}
            className="cursor-pointer text-white/75 hover:text-amber-100"
          />
        </div>
      )}
    </div>
  );
}
