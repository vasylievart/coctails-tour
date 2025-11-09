"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Calendar, CalendarIcon, Pen } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { bookingSchema } from "@/lib/validation";
import { useBookingDataContext } from "./hooks/BookingDataContext";
import { format } from "date-fns";
import { useBookingState } from "../booking_form/hooks/useBookingState";



interface ReusablePopupProps {
  open?: boolean;
  bookingData?: any; 
  capacity_left: number;
  mode?: "create" | "edit";
  className?: string;
  onClose?: () => void;
}

const ReusablePopup = ({ open = false, bookingData, mode = "create", capacity_left, onClose }: ReusablePopupProps) => {
  const supabase = createClient();
  const { formData, setFormData } = useBookingState();
  const [updatePlaces, setUpdatePlaces] = useState<number[]>([]);


  let bookingCtx: ReturnType<typeof useBookingDataContext> | null = null;
  try {
    bookingCtx = useBookingDataContext();
  } catch {
    // context not available (edit mode)
  }
  const [localShowPopup, setLocalShowPopup] = useState<boolean>(open);
  const showPopup = mode === "edit" ? localShowPopup : bookingCtx?.showPopup || false;
  const setShowPopup = mode === "edit" ? setLocalShowPopup : bookingCtx?.setShowPopup || (() => {});

  const handleClose = () => {
    setShowPopup(false);
    if (onClose) onClose();
  }

  if (mode === "edit") {
     useMemo(() => {
      if (capacity_left >= 0) {
        const createPlaces = () => {
        const pl = [];
        for ( let i = 1; i<capacity_left+1; i++ ) {
          pl.push(i);
        }
        setUpdatePlaces(pl)
        return updatePlaces;
      }
      createPlaces();
    } 
    },[capacity_left]);
  }

  const {
    tempDate,
    capacity,
    availableHour = [],
    isoAndCode = [],
    showCalendar = false,
    setShowCalendar = () => {},
    isEditable = false,
    setIsEditable = () => {},
    selectedDate,
    selectedHour,
    handleCalendarSelect = () => {},
    places = [1,2,3,4,5,6,7,8],
    handleHourChange = () => {},
    totalAmount,
    bookedPlaces,
    setBookedPlaces = () => {},
  } = bookingCtx || {};

  
  // ✅ Prefill form when editing
  useEffect(() => {
    if (bookingData) {
      setFormData({
        full_name: bookingData.full_name,
        email: bookingData.email,
        phone: bookingData.phone,
        country_code: bookingData.country_code,
        comment: bookingData.comment || "",
      });
    }
  }, [bookingData, setFormData]);

  const handleConfirm = async (e: any) => {
    e.preventDefault();

    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    const validatedData = result.data;

    try {
      if (mode === "edit" && bookingData?.id) {   
        const formattedDate = selectedDate 
        ? format(selectedDate, "yyyy-MM-dd") 
        : bookingData.booking_date;
        await supabase.rpc("update_booking_with_slot", {
          p_booking_id: bookingData.id,
          p_full_name: validatedData.full_name,
          p_email: validatedData.email,
          p_phone: validatedData.phone,
          p_country_code: validatedData.country_code,
          p_people_count: bookedPlaces || bookingData.people_count,
          p_booking_date: formattedDate,
          p_booking_hour: selectedHour || bookingData.booking_hour,
          p_comment: validatedData.comment,
        });

        // 🧩 Update existing booking
        /*await updateBooking(
          bookingData.id,
          formattedDate,
          selectedHour || bookingData.booking_hour,
          bookedPlaces || bookingData.people_count,
          validatedData
        );*/
        toast.success("Booking updated successfully!");
        setShowPopup(false);
        if (onClose) onClose();
      } else {
        // 🧩 Create new booking
        const { data, error } = await supabase.rpc("book_slot_atomic", {
          p_comment: validatedData.comment,
          p_country_code: validatedData.country_code,
          p_email: validatedData.email,
          p_full_name: validatedData.full_name,
          p_people_count: bookedPlaces,
          p_phone: validatedData.phone,
          p_slot_date: bookingCtx?.isoDate,
          p_slot_hour: selectedHour,
        });

        if (error || !data?.success) {
          console.error(error);
          toast.error(data?.error || "Failed to create booking");
          return;
        }

        toast.success(data.message || "Booking created successfully!");
        localStorage.clear();
        handleClose();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (mode === "edit") {
      setLocalShowPopup(open);
    }
  }, [open, mode]);



  if (!showPopup) return null;

  return (
    <AnimatePresence>
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
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-amber-100"
          >
            <X size={20} />
          </button>

          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar size={20} /> {mode === "edit" ? "Edit Booking" : "Booking Summary"}
          </h3>

          {/* Summary Section */}
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{tempDate || bookingData.booking_date}</span>
              <CalendarIcon
                size={16}
                className="cursor-pointer text-white/75 hover:text-amber-100"
                onClick={() => setShowCalendar(!showCalendar)}
              />
              {showCalendar && (
                <div className="absolute bg-amber-900/80 border-2 text-2xl text-white p-4 rounded-xl shadow-sm">
                  <DayPicker
                    mode="single"
                    disabled={{ before: new Date() }}
                    selected={selectedDate}
                    onSelect={handleCalendarSelect}
                    classNames={{
                      today: "bg-amber-700/60",
                      selected: "bg-amber-500/80 text-white rounded-full",
                      chevron: "fill-white"
                    }}
                  />
                </div>
              )}
            </div>

            {isEditable ? (
              <Select onValueChange={handleHourChange}>
                <SelectTrigger className="border-2 text-xl text-amber-50 rounded-lg focus:ring-2 focus:ring-amber-100">
                  <SelectValue placeholder="Hours" />
                </SelectTrigger>
                <SelectContent>
                  {availableHour.map((h, i) => (
                    <SelectItem key={i} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex justify-between items-center">
                <span>Hour:</span>
                <span>{selectedHour || bookingData?.booking_hour}</span>
                <Pen
                  onClick={() => setIsEditable(true)}
                  size={16}
                  className="cursor-pointer text-white/75 hover:text-amber-100"
                />
              </div>
            )}

            <div className="flex justify-between items-center">
              <span>People:</span>
              <span className="flex-row w-full">{capacity || capacity_left} places left</span>
              <Select onValueChange={(v) => setBookedPlaces(Number(v))}>
                <SelectTrigger className="border-2 text-xl text-amber-50 rounded-lg focus:ring-2 focus:ring-amber-100">
                  <SelectValue
                    placeholder={String(bookedPlaces || bookingData?.people_count || 1)}
                  />
                </SelectTrigger>
                {mode === "create" ? 
                  <SelectContent>
                  {places.map((p, i) => (
                    <SelectItem key={i} value={String(p)}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent> :
                <SelectContent>
                  {updatePlaces.map((c, i) => (
                    <SelectItem key={i} value={String(c)}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
                } 
              </Select>
            </div>

            <div className="flex justify-between">
              <span>Price:</span>
              <span>{totalAmount || bookingData?.amount} €</span>
            </div>
          </div>

          {/* Form Fields */}
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
              <Select
                onValueChange={(value) => setFormData({ ...formData, country_code: value })}
              >
                <SelectTrigger className="border-2 text-xl text-amber-50 rounded-lg focus:ring-2 focus:ring-amber-100">
                  <SelectValue placeholder={formData.country_code || "ES+34"} />
                </SelectTrigger>
                <SelectContent>
                  {isoAndCode.map((c, i) => (
                    <SelectItem key={i} value={c.code}>
                      {c.iso}
                      {c.code}
                    </SelectItem>
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
            onClick={handleConfirm}
            className="px-6 py-3 border-2 text-xl text-white rounded-xl focus:ring-2 focus:ring-amber-100 hover:text-amber-100 hover:bg-amber-800 hover:border-amber-100 shadow-md transition"
          >
            {mode === "edit" ? "Update Booking" : "Confirm Booking"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReusablePopup;
