import { AnimatePresence, motion } from "framer-motion"
import { Calendar, X } from "lucide-react"
import { useEffect, useState } from "react";
import ChangeDate from "./ChangeDate";
import ChangeHour from "./ChangeHour";
import { Booking } from "@/app/utils/types";

interface BookingPopupContainerProps {
  isOpen: boolean;
  specifiedDate: string | undefined;
  selectedHour?: string | undefined;
  open?: boolean;
  bookingData?: Booking; 
  capacity_left?: number | undefined;
  mode?: "create" | "edit";
  onClose?: () => void;
}

const BookingPopupContainer = ({isOpen= false, specifiedDate, bookingData, capacity_left, mode, selectedHour,  onClose}: BookingPopupContainerProps) => {
  //set state localy if BookingPopup is open

  return (
    <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex  justify-center items-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.35 }}
             className="
              max-h-[696px]
              bg-amber-900/90 
              border-2 border-white 
              rounded-2xl 
              shadow-xl 
              text-white 
              p-5 sm:p-6 
              relative
            "

            >
              <button
                onClick={onClose}
                aria-label="Close booking popup"
                className="absolute top-3 right-3 text-white hover:text-amber-100 transition"
              >
                <X size={22} />
              </button>

              <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar size={20} /> Booking Summary
              </h3>
              <div className="space-y-2 mb-4"> 
                 <ChangeDate rowDate={specifiedDate} bookingDate={bookingData} mode={mode}/>
                <ChangeHour hour={selectedHour} editable={false} isoDate={specifiedDate} bookingDate={bookingData} mode={mode} capacityInit={capacity_left} onClose={onClose}/>
              </div>          
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    
  )
}

export default BookingPopupContainer;
