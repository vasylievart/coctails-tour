"use client";

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { SelectValue } from "@radix-ui/react-select"
import { AnimatePresence, motion } from "framer-motion"
import { Calendar, CalendarIcon, Pen, X } from "lucide-react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css";
import { useBookingState } from "../booking_form/hooks/useBookingState"
import toast from "react-hot-toast"
import { bookingSchema } from "@/lib/validation"
import { createClient } from "@/utils/supabase/client"
import { useBookingDataContext } from "./hooks/BookingDataContext";

const BookingPopup = () => {
  const supabase = createClient();
  const {formData, setFormData} = useBookingState();
  const {
    showPopup, 
    setShowPopup, 
    tempDate, 
    capacity, 
    availableHour, 
    isoAndCode, 
    showCalendar,
    setShowCalendar, 
    isEditable, 
    setIsEditable,
    selectedDate, 
    selectedHour,
    handleCalendarSelect,
    places,
    handleHourChange,
    totalAmount,
    isoDate,
    bookedPlaces,
    setBookedPlaces

  } = useBookingDataContext();

  console.log("Client show popup", showPopup);

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
    <>
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
                <div className="flex justify-between gap-4 items-center">
                  <span>People:</span>
                  <span className="flex-row w-full">{capacity} places left</span>
                  <Select onValueChange={(v) => setBookedPlaces(Number(v))}>
                    <SelectTrigger className="border-2 text-xl text-amber-50  rounded-lg focus:ring-2 focus:ring-amber-100">
                      <SelectValue placeholder="People"/>
                    </SelectTrigger>
                    <SelectContent>
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
    </>
  )
}

export default BookingPopup;


