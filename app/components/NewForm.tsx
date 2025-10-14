"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CalendarIcon, Pen, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "../../lib/supabase-client";
import { format, parse } from "date-fns";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { IMaskInput } from "react-imask";
import { bookingSchema } from "@/lib/validation";
import { usePersistentState } from "../hooks/usePresistentState";
import { countryPhoneCodes } from "../utils/phone_codes";
import { listOfMonths } from "../utils/months";

const NewForm = () => {
  const currentYear = new Date().getFullYear();
  const [selectedDate, setSelectedDate] = usePersistentState<Date | null>(
    "booking-date",
    new Date()
  );
  const [tempDate, setTempDate] = useState<string>(format(new Date(), "dd.MM.yyyy"));
  const [showCalendar, setShowCalendar] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [selectedHour, setSelectedHour] = usePersistentState<string | null>("booking-hour", null);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = usePersistentState("booking-form", {
    fullName: "",
    email: "",
    countryCode: "",
    phone: "",
    comment: "",
  });

  const isoAndCode = countryPhoneCodes;
  const months = listOfMonths;
  const price = 150;
  const hours = ["17:00", "18:00", "19:30", "21:00", "22:30"];

  const handleBook = () => {
    if (!selectedDate || !selectedHour) return;
    setShowPopup(true);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempDate(e.target.value);
  };

  const handleDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      try {
        const newDate = parse(tempDate, "dd.MM.yyyy", new Date());
        if (!isNaN(newDate.getTime())) {
          setSelectedDate(newDate);
          setIsEditable(false);
        } else {
          alert("Invalid date format. Use DD.MM.YYYY");
        }
      } catch {
        alert("Invalid date format. Use DD.MM.YYYY");
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

  const handleConfirm = async (e: any) => {
    e.preventDefault();
    if (!selectedDate || !selectedHour) return;

    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      console.error("Validation failed:", result.error.format);
      return;
    }

    const formattedDate = format(selectedDate, "dd.MM.yyyy");
    const { error } = await supabase.from("booking").insert({
      date: formattedDate,
      hour: selectedHour,
      ...result.data,
    });

    if (error) {
      console.error("Error creating booking:", error.message);
    } else {
      alert("Booking submitted!");
      localStorage.clear();
      setShowPopup(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-10">
      <h2 className="text-3xl text-white font-semibold mb-6">Book Your Cocktail Tour</h2>

      {/* Hour selection */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {hours.map((hour) => (
          <button
            key={hour}
            onClick={() => setSelectedHour(hour)}
            className={`px-4 py-2 rounded-lg border transition ${
              selectedHour === hour
                ? "bg-amber-800 text-white border-amber-100"
                : "border-2 text-white hover:text-amber-100 hover:border-amber-100"
            }`}
          >
            {hour}
          </button>
        ))}
      </div>

      {selectedHour && (
        <motion.button
          onClick={handleBook}
          whileHover={{ scale: 1.05 }}
          className="px-6 py-3 border-2 text-2xl text-white rounded-xl hover:bg-amber-800 hover:text-amber-100 transition"
        >
          Book Now
        </motion.button>
      )}

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="p-6 rounded-2xl bg-amber-900/65 text-white border-2 border-white shadow-xl w-[90%] max-w-md relative"
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-white hover:text-amber-100"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar size={20} /> Booking Summary
              </h3>

              {/* Editable date field */}
              {isEditable ? (
                <div className="relative mb-4">
                  <IMaskInput
                    mask="99.99.9999"
                    value={tempDate}
                    onChange={handleDateChange}
                    onKeyDown={handleDateKeyDown}
                    placeholder="DD.MM.YYYY"
                    className="w-full border-2 p-2 rounded-lg focus:ring-2 focus:ring-amber-400 text-lg"
                  />
                  <CalendarIcon
                    size={20}
                    className="absolute right-3 top-3 text-white cursor-pointer hover:text-amber-100"
                    onClick={() => setShowCalendar(!showCalendar)}
                  />
                  {showCalendar && (
                    <div className="absolute bg-amber-900/80 border p-3 rounded-xl z-50">
                      <DayPicker
                        mode="single"
                        selected={selectedDate ?? new Date()}
                        onSelect={handleCalendarSelect}
                        classNames={{
                          today: "border-white",
                          selected: "bg-amber-500 text-white rounded-full",
                          chevron: "fill-white",
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center mb-4">
                  <span>Date:</span>
                  <span>{selectedDate ? format(selectedDate, "dd.MM.yyyy") : ""}</span>
                  <Pen
                    onClick={() => {
                      setIsEditable(true);
                      setTempDate(format(selectedDate ?? new Date(), "dd.MM.yyyy"));
                    }}
                    size={16}
                    className="cursor-pointer text-white/75 hover:text-amber-100"
                  />
                </div>
              )}

              <div className="flex justify-between items-center mb-4">
                <span>Hour:</span>
                <span>{selectedHour}</span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span>Price:</span>
                <span>{price} €</span>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full mt-4 border-2 text-lg text-white rounded-lg p-3 hover:bg-amber-800 hover:text-amber-100 transition"
              >
                Confirm Booking
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewForm;
