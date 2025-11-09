import { AnimatePresence, motion } from "framer-motion"
import { Calendar, X } from "lucide-react"
import { useEffect, useState } from "react";
import ChangeDate from "./ChangeDate";
import ChangeHour from "./ChangeHour";

interface BookingPopupContainerProps {
  isOpen: boolean;
  specifiedDate: any;
  selectedHour?: any;
  open?: boolean;
  bookingData?: any; 
  capacity_left?: number | undefined;
  mode?: "create" | "edit";
  onClose?: () => void;
}


const BookingPopupContainer = ({isOpen= false, specifiedDate, bookingData, capacity_left, mode, selectedHour,  onClose}: BookingPopupContainerProps) => {
  //set state localy if BookingPopup is open
  const [showPopup, setShowPopup] = useState<boolean>(isOpen);
  console.log("Mode is:", mode);
  console.log("Selected Hour", selectedHour)

  useEffect(() => {
    setShowPopup(isOpen);
  }, [isOpen]);


  return (
    <div>
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
              {/*Get booking data from previous step and we can modify it in ChangeDate*/}
              <div className="space-y-2 mb-4"> 
                 <ChangeDate rowDate={specifiedDate} bookingDate={bookingData} mode={mode}/>

                {/*Get booking data from previous step and we can modify it in ChangeHour*/}
                <ChangeHour hour={selectedHour} editable={false} isoDate={specifiedDate} bookingDate={bookingData} mode={mode} capacityInit={capacity_left} onClose={() =>{setShowPopup(false); onClose?.();}}/>
              </div>          
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BookingPopupContainer;