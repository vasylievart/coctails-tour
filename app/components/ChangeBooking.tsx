"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { getBookingByEmailAndPhone, getCapacityLeftBySlotId} from "../dashboard/bookings/booking.actions";
import BookingPopupContainer from "./booking_form/BookingPopupContainer";


export default function ChangeBooking() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [booking, setBooking] = useState<any | null>(null);
  const [capacity, setCapacity] = useState<any | null>(null);
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
  setCapacity(null);
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
    <div className=" p-6 bg-amber-700/60 border-white shadow-xl w-[90%] max-w-md relativemax-w-md mx-auto mt-10 space-y-4 border-2 text-xl text-amber-50  rounded-lg focus:ring-2 focus:ring-amber-100 z-50">
      <h2 className="text-2xl font-semibold text-center">Find Your Booking</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full border p-2 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone (without country code)
          </label>
          <input
            id="phone"
            type="tel"
            required
            className="w-full border p-2 rounded-md"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <Button className="bg-amber-700/60 px-6 py-6 border-2 text-2xl text-white rounded-xl  focus:ring-2 focus:ring-amber-100 hover:text-amber-100 hover:bg-amber-800 hover:border-amber-100 shadow-md transition" type="submit" disabled={isPending}>
          {isPending ? "Searching..." : "Find Booking"}
        </Button>
      </form>

      {notFound && (
        <p className="text-center text-red-500">No booking found with that email and phone number.</p>
      )}
    </div>
  );
}
