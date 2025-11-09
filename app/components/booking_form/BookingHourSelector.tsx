"use client";

import { motion } from "framer-motion";
import { useBookingData } from "./hooks/useBookingData";
import BookingPopupContainer from "../booking_form/BookingPopupContainer";

interface BookingHourSelectorProps {
  isoDate: string;
}



const BookingHourSelector = ({isoDate}:BookingHourSelectorProps) => {
  //get data from custom hook 
  const {availableHour, selectedHour, setSelectedHour, handleBook, showPopup} = useBookingData();



  return (
    <div className="flex flex-col items-center">
      {/*Select specified hour */}
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
      {availableHour.length === 0 && <p className="text-white/70">No hours available this day</p>}


      {selectedHour && (
        <motion.button
          onClick={handleBook}
          whileHover={{ scale: 1.05 }}
          className="px-6 py-3   border-2 text-2xl text-white p-4 rounded-xl  focus:ring-2 focus:ring-amber-100 hover:text-amber-100 hover:bg-amber-800 hover:border-amber-100 shadow-md transition"
        >
          Book Now
        </motion.button>
      )}
      {/*Pass date to BookingPopupContainer all calculatio dispach by useBookingData hook */}
      <BookingPopupContainer isOpen={showPopup} specifiedDate={isoDate} mode={"create"} selectedHour={selectedHour}/>
    </div>
  )
}

export default BookingHourSelector;

