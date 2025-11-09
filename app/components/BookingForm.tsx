"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar,CalendarIcon,Pen, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { countryPhoneCodes } from "../utils/phone_codes";
import { listOfMonths } from "../utils/months";
import { bookingSchema } from "@/lib/validation";
import { usePersistentState } from "../hooks/usePresistentState";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";




//TODO: 
//      Split BookingForm into smaller components
//      Create Dashboard
//      Auth
//      Create test
//      Readme
//      Deploy


const BookingForm = () => {
  const supabase = createClient();
  // set all current date variables with current values: day, month, year
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  // states forset new year, month and day
  const [year, setYear] = usePersistentState<number>("booking-year", currentYear);
  const [month, setMonth] = usePersistentState<number | null>("booking-month", currentMonth);
  const [day, setDay] = usePersistentState<number | null>("booking-day", currentDay);
  //states for futher functions
  const [availableDays, setAvailableDays] = useState<number[]>([]);
  const [selectedHour, setSelectedHour] = usePersistentState<string>("booking-hour", "");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [tempDate, setTempDate] = useState<string>("");
  const [availableHour, setAvailableHours] = useState<string[]>([]);
  // states for open(close popup, for set editable and open calendar)
  const [showPopup, setShowPopup] = useState(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState(false);
  // state for dynamic values that we received from supabase db
  const [capacity, setCapacity] = usePersistentState<number>("people-quantity", 0);
  const [places, setAvalablePlaces] = usePersistentState<number[]>("booking-places", [0]);
  const [bookedPlaces, setBookedPlaces] = usePersistentState<number>("booked-places", 0);
  //form data states
  const [formData, setFormData] = usePersistentState("booking-form", {
    full_name: "",
    email: "",
    country_code: "",
    phone: "",
    comment: "",
  });




  const isoAndCode = countryPhoneCodes;
  const months = listOfMonths;
  const price = 150;
  const totalAmount = price * bookedPlaces;
 //depend of current year, month and day => mapping all available days in month
  useEffect(() => {
    if (month !== null) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      setAvailableDays(daysArray);
    } else {
      setAvailableDays([]);
    }
  }, [year, month]);
  
  //set current day
   useMemo(() => {
    setDay(currentDay)
  },[currentDay]);

  //set first main tempDate
  useEffect(() => {
    if (day && month !== null && year) {
      const date = `${day}.${month + 1}.${year}`;
      setTempDate(date);
    }
  }, [day, month, year]);

  //formate date
  const isoDate = tempDate
  .replace(/\./g, "-")
  .split("-")
  .reverse()
  .join("-")
  .trim();
 // when we received tempDate => fetching slot_hour from slots
  useEffect(() => {
      const getHours = async () => {
        if (!isoDate) return;

        const { data, error } = await supabase
          .from("slots")
          .select("slot_hour, capacity_left")
          .eq("slot_date", isoDate)
          .gt("capacity_left", 0)
          .eq("disabled", false);
        
        if (error) {
          console.error("Error fetching hours:", error.message);
          return;
        }
        
        if (data) {
          const hours = data.map(item => item.slot_hour);
          setAvailableHours(hours);
        }
      };

    getHours();
  }, [tempDate]);
  //fetch capacity_left from supabase db depend of cuurent slot_hour, and slot_date
  useEffect(() => {
    if (!isoDate || !selectedHour) return;

    const getCapacity = async () => {
      const { data, error } = await supabase
        .from("slots")
        .select("capacity_left")
        .eq("slot_date", isoDate)
        .eq("slot_hour", selectedHour)
        .single();

      if (!error && data) setCapacity(data.capacity_left);
    };

    getCapacity();
  }, [tempDate, selectedHour]);

  // covert capacity_left number into array for selecct component
  useMemo(() => {
    const createPlaces = () => {
    const pl = [];
    for ( let i = 1; i<capacity+1; i++ ) {
      pl.push(i);
    }
    setAvalablePlaces(pl)
    return places;
  }
  createPlaces();
  },[capacity])
  
 //when we got current day (slot_date), set cuurent hour (slot_hour) => setShowPopup(true)
  const handleBook = () => {
    if (!day || !selectedHour) return;
    setShowPopup(true);
  };
 //local function for change booking_hour if we need
  function handleHourChange(newHour: string) {
  setSelectedHour(newHour);
  setIsEditable(false);
  }
  //set new date from DayPicker calendar
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
  
  //function for validate data and create new booking
  const handleConfirm = async (e: any) => {
    e.preventDefault();

    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      console.error("❌ Validation failed:", result.error.issues);
      return;
    }
  
    const validatedData = result.data;
   
    try {
      const { data, error } = await supabase
      .rpc('book_slot_atomic', {
        p_comment: validatedData.comment, 
        p_country_code: validatedData.country_code, 
        p_email: validatedData.email, 
        p_full_name: validatedData.full_name, 
        p_people_count: bookedPlaces, 
        p_phone: validatedData.phone, 
        p_slot_date: isoDate, 
        p_slot_hour: selectedHour
      })

      if(data.success){
        toast(data.message, {
          icon: '👏',
          iconTheme: {
            primary: '#000',
            secondary: '#fff',
          },
          duration: 4000,
          position: 'top-center',})
      }

      if (error) {
          console.error("❌ RPC error:", error.message);
          alert("Booking failed, please try again later.");
          return;
        }

      if (!data?.success) {
        
        console.warn("⚠️ Booking failed:", data?.error);
        alert(`Booking failed: ${data?.error}`);
        return;
      }

      console.log(`✅ Booking successful, ${data.remaining_capacity} places left`);
      alert(`Booking confirmed! ${data.remaining_capacity} places left for this time slot.`);

      localStorage.clear();
      setShowPopup(false);
    } catch (err) {
      console.error("🚨 Unexpected error:", err);
      alert("Unexpected error while processing your booking.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-10 z-50" >
      <h2 className="text-3xl text-white font-semibold mb-6">Book Your Cocktail Tour</h2>
      {/*First component we have to set a spacified Date*/}

      {/*First step - set year*/}
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
       {/*Second step - set month*/}
        <Select
          value={month !== null ? String(month) : ""}
          onValueChange={(value) => setMonth(value === "" ? null : Number(value))}
        >
          <SelectTrigger className="border-2 text-2xl text-white p-4 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 hover:text-amber-700 hover:border-amber-400">
            <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="Month"></SelectItem>
              {months.map((m, i) => {
                const isPastMonth = year === currentYear && i < currentMonth;
                return (
                  <SelectItem key={m} value={String(i)} disabled={isPastMonth} className={isPastMonth ? "opacity-40 cursor-not-allowed" : ""}>
                  {m}
                </SelectItem>
                ); 
              })}
            </SelectContent>
        </Select>
        {/*Third step. Depend of current month it returns us days in month and set day*/}
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
              {availableDays.map((d) => {
                const isPastDay = month === currentMonth && d < currentDay;
                return (
                  <SelectItem key={d} value={String(d)} disabled={isPastDay} className={isPastDay ? "opacity-40 cursor-not-allowed" : ""}>
                  {d}
                </SelectItem>
                )
                
              })}
            </SelectContent>
        </Select>
      </div>

      {/*We've set Date in format yyyy-MM-dd in supabase db will be booking_date equal slot_date, and supabase db return from slots => slots_hour depend of current day*/}
      {/*Forth step - set hour (slot_hour) => return available slot_hour in current dat (booking_date/slot_date)*/}
      {/* Hours */}
      {day && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-3 mb-6"
        >
          {availableHour.map((hour) => (
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
      {/*Fifth step - when hour selected (slot_hour/booking_hour) we can handle booking. Then showPopup will be set as true and BookingPopup will be opened*/}

      {selectedHour && (
        <motion.button
          onClick={handleBook}
          whileHover={{ scale: 1.05 }}
          className="px-6 py-3 border-2 text-2xl text-white p-4 rounded-xl  focus:ring-2 focus:ring-amber-100 hover:text-amber-100 hover:bg-amber-800 hover:border-amber-100 shadow-md transition"
        >
          Book Now
        </motion.button>
      )}

      {/*Steps: tempDate => setSelectedHour => handleBook => setShowPopup as true */}

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
              {/*BookingPopup: first line is Date, we received tempDate as a value.*/}
              <div className="space-y-2 mb-4"> 
                  <div className="relative flex justify-between items-center">
                    <span>Date:</span>
                    <span>{tempDate}</span>
                    {/*Here we can change tempDate => open calendar setShowCalendar as true*/}
                    <CalendarIcon
                      size={16}
                      className="cursor-pointer text-white/75 hover:text-amber-100"
                      onClick={() => setShowCalendar(!showCalendar)}
                    />
                    {/*When showCalendar is true => open DayPicher => setSelectedDate(newDate)*/}
                    { showCalendar && (
                      <div className="absolute bg-amber-900/80 border-2 text-2xl text-white p-4 rounded-xl shadow-sm ">
                        <DayPicker
                          mode="single"
                          disabled={{before: new Date()}}
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

                {/*BookingPopup: Second step => if we need we can change, as a props we received slot_hour from previous step*/}
                { isEditable ?
                  <Select onValueChange={handleHourChange}>
                    <SelectTrigger className="border-2 text-xl text-amber-50  rounded-lg focus:ring-2 focus:ring-amber-100">
                      <SelectValue placeholder="Hours"/>
                    </SelectTrigger>
                    <SelectContent>
                      {availableHour.map((h, i) => (
                          <SelectItem key={i} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select> :
                <div className="flex justify-between items-center">
                  <span>Hour:</span>
                  <span>{selectedHour}</span>
                  <Pen onClick={() => setIsEditable(true)}  size={16} className="cursor-pointer text-white/75 hover:text-amber-100" />
                </div>}
                {/*BookingPopup: Thirs step: set people_count*/}
                <div className="flex justify-between gap-4 items-center">
                  <span>People:</span>
                  <span className="flex-row w-full">{capacity} places left</span>
                  <Select onValueChange={(v) => setBookedPlaces(Number(v))}>
                    <SelectTrigger className="border-2 text-xl text-amber-50  rounded-lg focus:ring-2 focus:ring-amber-100">
                      <SelectValue placeholder="People"/>
                    </SelectTrigger>
                    <SelectContent>
                      {/*We received from supabase db capacity_left for current slot_hour*/}
                      {places.map((p, i) => (
                          <SelectItem key={i} value={String(p)}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
          
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Price:</span>
                  <span>{totalAmount} €</span>
                </div>
              </div>
              {/*BookingPopup: Fouth step - set formData : full_name, email, phone, country_code, comment*/}
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
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
                  <Select onValueChange={(value) => setFormData({...formData, country_code: value})}>
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
              {/*Bookingpopup: handleConfirm => booking data will be set to supabase db : booking_date, booking_hour, people_count, full_name, email etc.*/}
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
