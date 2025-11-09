"use client";

import { createContext, useContext } from "react";
import { useBookingData } from "../../booking_form/hooks/useBookingData";


const BookingDataContext = createContext<ReturnType<typeof useBookingData> | null>(null);

export const BookingDataProvider = ({ children }: { children: React.ReactNode }) => {
  const booking = useBookingData();
  return <BookingDataContext.Provider value={booking}>{children}</BookingDataContext.Provider>;
};

export const useBookingDataContext = () => {
  const context = useContext(BookingDataContext);
  if (!context) throw new Error("useBookingDataContext must be used inside BookingDataProvider");
  return context;
};
