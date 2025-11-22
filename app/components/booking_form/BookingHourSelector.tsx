"use client";

import { motion } from "framer-motion";
import { useBookingData } from "./hooks/useBookingData";
import BookingPopupContainer from "../booking_form/BookingPopupContainer";

interface BookingHourSelectorProps {
  isoDate: string;
}

const BookingHourSelector = ({isoDate}:BookingHourSelectorProps) => {
  //get data from custom hook 
  const {availableHour, selectedHour, setSelectedHour, handleBook, showPopup, setShowPopup} = useBookingData();

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-6"
      >
        {availableHour.map((hour) => (
          <button
            key={hour}
            onClick={() => setSelectedHour(hour)}
            className={`px-3 sm:px-4 text-base py-1.5 sm:py-2 rounded-lg border font-semibold sm:text-lg md:text-xl transition ${
              selectedHour === hour
                ? "text-2xl bg-amber-800 opacity-70 text-white border-amber-100"
                : "border-2 text-2xl text-white p-4 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-100 hover:text-amber-100 hover:border-amber-100"
            }`}
          >
            {hour}
          </button>
        ))}
      </motion.div>
      {availableHour.length === 0 && <p className="text-white/70">No hours available this day</p>}

      <motion.button
        onClick={handleBook}
        whileHover={{ scale: selectedHour ? 1.03 : 1 }}
        whileTap={{ scale: selectedHour ? 0.97 : 1 }}
        disabled={!selectedHour}
        className={`
          sm:w-auto
          px-4 sm:px-6 py-3 sm:py-4
          text-lg sm:text-xl md:text-2xl
          font-semibold rounded-xl
          border-2
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-amber-200
          shadow-md
          ${
            selectedHour
              ? "bg-amber-700/80 text-white hover:bg-amber-800 hover:border-amber-100"
              : "bg-amber-800/40 text-amber-300 border-amber-400 cursor-not-allowed opacity-70"
          }
        `}
      >
        Book Now
      </motion.button>
  
      <BookingPopupContainer 
        isOpen={showPopup}  
        specifiedDate={isoDate}
        mode={"create"} 
        selectedHour={selectedHour} 
        onClose={() => setShowPopup(false)}
        />
    </div>
  )
}

export default BookingHourSelector;



