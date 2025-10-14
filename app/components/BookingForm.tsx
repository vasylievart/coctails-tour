"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar,CalendarIcon,Pen, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "../../lib/supabase-client";
import { countryPhoneCodes } from "../utils/phone_codes";
import { listOfMonths } from "../utils/months";
import { bookingSchema } from "@/lib/validation";
import { usePersistentState } from "../hooks/usePresistentState";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

//TODO: Chenging time and date of event directly in form
//      Fix problem with availble date (don't use past months
//      Fix Privacy Policy and Term of Srvice
//      Create FAQ component
//      Split BookingForm into smaller components
//      Create Dashboard
//      Auth
//      Create test
//      Readme
//      Deploy


const BookingForm = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = usePersistentState<number>("booking-year", currentYear);
  const [month, setMonth] = usePersistentState<number | null>("booking-month", null);
  const [day, setDay] = usePersistentState<number | null>("booking-day", null);
  const [availableDays, setAvailableDays] = useState<number[]>([]);
  const [selectedHour, setSelectedHour] = usePersistentState<string | null>("booking-hour", null);
  const [showPopup, setShowPopup] = useState(false);
  const [isEditable, setIsEditable] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);
  //const date = `${day}.${month! + 1}.${year}`;
  const [tempDate, setTempDate] = useState<string>("");
  console.log("Initial tempDate :",tempDate);
  const [formData, setFormData] = usePersistentState("booking-form", {
    fullName: "",
    email: "",
    countryCode: "",
    phone: "",
    comment: "",
  });

  useEffect(() => {
  if (day && month !== null && year) {
    const date = `${day}.${month + 1}.${year}`;
    setTempDate(date);
    console.log("Initial date :", date );
  }
}, [day, month, year]);

  const hours = ["17:00","18:00","19:30","21:00","22:30"];
  const isoAndCode = countryPhoneCodes;
  const months = listOfMonths;
  const price = 150;

  useEffect(() => {
    if (month !== null) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      setAvailableDays(daysArray);
    } else {
      setAvailableDays([]);
    }
  }, [year, month]);

  const handleBook = () => {
    if (!day || !selectedHour) return;
    setShowPopup(true);
  };

  function handleHourChange(newHour: string) {
  const previousHour = selectedHour;
  setSelectedHour(newHour);
  setIsEditable(false);
  }
 

  const handleCalendarSelect = (newDate: Date | undefined) => {
  if (!newDate) return;

  const d = newDate.getDate();
  const m = newDate.getMonth();
  const y = newDate.getFullYear();

  setSelectedDate(newDate);
  setTempDate(format(newDate, "dd.MM.yyyy"));
  setDay(d);
  setMonth(m);
  setYear(y);

  setShowCalendar(false);
  setIsEditable(false);
  };

  
  const handleConfirm = async  (e:any) => {
    console.log({
      date: `${day}.${month! + 1}.${year}`,
      time: selectedHour,
      price,
      ...formData,
    });
    e.preventDefault()

    const result = bookingSchema.safeParse(formData);

    const validateData = result.data;

    if (!result.success) {
      console.error("Fail validation data: ", result.error.format);
      return
    }

    const {error} = await supabase.from("booking").insert({date: `${day}.${month! + 1}.${year}`, hour: selectedHour, ...validateData}).single()

    if (error) {
      console.error("Error creating booking:", error.message)
    }

    console.log("Form data is:", formData);
    localStorage.clear();
    setShowPopup(false);
  };

  return (
    <div className="w-full flex flex-col items-center py-10">
      <h2 className="text-3xl text-white font-semibold mb-6">Book Your Cocktail Tour</h2>

      <div className="flex gap-4 flex-wrap justify-center mb-6">
        <Select value={String(year)} onValueChange={(value) => setYear(Number(value))}>
          <SelectTrigger className="border-2 text-2xl text-white p-4 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 hover:text-amber-700 hover:border-amber-400">
            <SelectValue placeholder="Years" />
          </SelectTrigger>
          <SelectContent>
            {[currentYear, currentYear + 1].map((y) => (
            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
          ))}
          </SelectContent>
        </Select>
       
        <Select
          value={month !== null ? String(month) : ""}
          onValueChange={(value) => setMonth(value === "" ? null : Number(value))}
        >
          <SelectTrigger className="border-2 text-2xl text-white p-4 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 hover:text-amber-700 hover:border-amber-400">
            <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="Month"></SelectItem>
              {months.map((m, i) => (
                <SelectItem key={m} value={String(i)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
        </Select>

        <Select
          value={day !== null ? String(day) : ""}
          onValueChange={(value) => setDay(value === "" ? null : Number(value))}
          disabled = {!month}
        >
          <SelectTrigger className="border-2 text-2xl text-white p-4 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 hover:text-amber-700 hover:border-amber-400">
            <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="Day"></SelectItem>
              {availableDays.map((d) => (
                <SelectItem key={d} value={String(d)}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
        </Select>
      </div>

      {/* Hours */}
      {day && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-3 mb-6"
        >
          {hours.map((hour) => (
            <button
              key={hour}
              onClick={() => setSelectedHour(hour)}
              className={`px-4 py-2 rounded-lg border transition ${
                selectedHour === hour
                  ? "text-2xl bg-amber-800 opacity-70 text-white border-amber-100"
                  : "border-2 text-2xl text-white p-4 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-100 hover:text-amber-100 hover:border-amber-100"
              }`}
            >
              {hour}
            </button>
          ))}
        </motion.div>
      )}

      {selectedHour && (
        <motion.button
          onClick={handleBook}
          whileHover={{ scale: 1.05 }}
          className="px-6 py-3 border-2 text-2xl text-white p-4 rounded-xl  focus:ring-2 focus:ring-amber-100 hover:text-amber-100 hover:bg-amber-800 hover:border-amber-100 shadow-md transition"
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

              <div className="space-y-2 mb-4"> 
                  <div className="relative flex justify-between items-center">
                    <span>Date:</span>
                    <span>{tempDate}</span>
                    <CalendarIcon
                      size={16}
                      className="cursor-pointer text-white/75 hover:text-amber-100"
                      onClick={() => setShowCalendar(!showCalendar)}
                    />
                    { showCalendar && (
                      <div className="absolute bg-amber-900/80 border-2 text-2xl text-white p-4 rounded-xl shadow-sm ">
                        <DayPicker
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleCalendarSelect}
                          classNames={{
                            today: "bg-amber-700/60",
                            selected: `bg-amber-500/80  text-white rounded-full`,
                            chevron: "fill-white"
                          }}
                        />
                      </div>
                     )
                    }
                  </div>
                
                { isEditable ?
                  <Select onValueChange={handleHourChange}>
                    <SelectTrigger className="border-2 text-xl text-amber-50  rounded-lg focus:ring-2 focus:ring-amber-100">
                      <SelectValue placeholder="Hours"/>
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map((h, i) => (
                          <SelectItem key={i} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select> :
                <div className="flex justify-between items-center">
                  <span>Hour:</span>
                  <span>{selectedHour}</span>
                  <Pen onClick={() => setIsEditable(true)}  size={16} className="cursor-pointer text-white/75 hover:text-amber-100" />
                </div>}
                <div className="flex justify-between items-center">
                  <span>Price:</span>
                  <span>{price} €</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full border-2 p-2 rounded-lg focus:ring-2 focus:ring-amber-100"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border-2 p-2 rounded-lg focus:ring-2 focus:ring-amber-100"
                />
                <div className="flex gap-2">
                  <Select onValueChange={(value) => setFormData({...formData, countryCode: value})}>
                    <SelectTrigger className="border-2 text-2xl text-amber-50  rounded-lg focus:ring-2 focus:ring-amber-100">
                      <SelectValue placeholder="ES+34"/>
                    </SelectTrigger>
                    <SelectContent>
                      {isoAndCode.map((c, i) => (
                          <SelectItem key={i} value={c.code}>{c.iso}{c.code}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border-2 p-2 rounded-lg focus:ring-2 focus:ring-amber-100"
                  />
                </div>
                
                <textarea
                  placeholder="Comment (optional)"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full border-2 p-2 rounded-lg focus:ring-2 focus:ring-amber-100"
                />
              </div>

              <button
                onClick={(e) => handleConfirm(e)}
                className="px-6 py-3 border-2 text-2xl text-white p-4 rounded-xl  focus:ring-2 focus:ring-amber-100 hover:text-amber-100 hover:bg-amber-800 hover:border-amber-100 shadow-md transition"
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

export default BookingForm;
