"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { getBookingByEmailAndPhone, getCapacityLeftBySlotId} from "../dashboard/bookings/booking.actions";
import BookingPopupContainer from "./booking_form/BookingPopupContainer";
import { Booking} from "../utils/types";


export default function ChangeBooking() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [capacity, setCapacity] = useState<number | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);
  const [isPending, startTransition] = useTransition();

  

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setNotFound(false);

  startTransition(async () => {
    const result = await getBookingByEmailAndPhone(email, phone);

    if (result) {
      setBooking(result);
      const placesLeft = await getCapacityLeftBySlotId(result.slot_id);
      if (placesLeft !== null) setCapacity(placesLeft);
    } else {
      setNotFound(true);
    }
  });
};


const handleClosePopup = () => {
  setBooking(null);
  setCapacity(undefined);
  setNotFound(false);
  setEmail("");
  setPhone("");
}


  if (booking) {
    return (
      <BookingPopupContainer isOpen={true} specifiedDate={""} bookingData={booking} capacity_left={capacity} onClose={handleClosePopup} mode={"edit"}/>  
    );
  } 

  return (
    <div 
      className="
        w-[92%] sm:w-[85%] md:w-[70%] lg:max-w-md
        mx-auto mt-8 sm:mt-10
        p-4 sm:p-6 md:p-8
        bg-amber-700/60 border-2 border-white rounded-xl shadow-xl
        text-base sm:text-lg md:text-xl text-amber-50
        focus:ring-2 focus:ring-amber-100
        space-y-5 sm:space-y-6
        z-40
      "
      >
      <h2
        className="text-xl sm:text-2xl md:text-3xl font-semibold text-center"
      >Find Your Booking</h2>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm sm:text-base font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="
              w-full border border-amber-100/50 p-2 sm:p-3 rounded-md
              bg-amber-950/10 text-amber-50 placeholder-amber-200
              focus:outline-none focus:ring-2 focus:ring-amber-200
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm sm:text-base font-medium mb-1">
            Phone (without country code)
          </label>
          <input
            id="phone"
            type="tel"
            required
            className="
              w-full border border-amber-100/50 p-2 sm:p-3 rounded-md
              bg-amber-950/10 text-amber-50 placeholder-amber-200
              focus:outline-none focus:ring-2 focus:ring-amber-200
            "
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <Button 
          className="
            w-full mt-3 p-6  text-lg sm:text-xl font-semibold
            bg-amber-700/70 border-2 border-amber-100 text-white rounded-xl
            hover:bg-amber-800 hover:border-amber-100 hover:text-amber-100
            focus:ring-2 focus:ring-amber-100 shadow-md transition-all
          "
          type="submit" disabled={isPending}>
          {isPending ? "Searching..." : "Find Booking"}
        </Button>
      </form>

      {notFound && (
        <p className="text-center text-red-400 text-sm sm:text-base mt-3">No booking found with that email and phone number.</p>
      )}
    </div>
  );
}
