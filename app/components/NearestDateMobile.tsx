import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Slots } from "../utils/types";

interface NearestDateMobileProps {
  showPopup: boolean;
  setShowPopup: (value: boolean) => void;
  prettySlotLabel: (slot: Slots | null) => string;
  closest: Slots | null;
  handleQuickBook: () => void;
}

const NearestDateMobile = ({
  setShowPopup,
  prettySlotLabel,
  closest,
  handleQuickBook
}: NearestDateMobileProps) => {

  const [dropUp, setDropUp] = useState<boolean>(false);

  return (
    <div className="md:hidden fixed bottom-4 right-4 z-50">

      {/* Floating Button that OPENS DROP-UP */}
      <motion.button
        onClick={() => setDropUp(true)}
        className="bg-amber-500 shadow-lg shadow-black/40 text-white 
                   px-4 py-3 rounded-full font-semibold 
                   flex items-center gap-2"
        whileTap={{ scale: 0.92 }}
      >
        🍹 Nearest Tour
      </motion.button>

      {/* DROP-UP */}
      <AnimatePresence>
        {dropUp && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-14 right-0 w-[90vw] max-w-xs 
                       bg-amber-600/90 backdrop-blur-md 
                       shadow-xl rounded-2xl p-4 text-white"
          >
            {/* Title */}
            <div className="text-center font-semibold text-lg mb-2">
              Next Tour
            </div>

            {/* Date */}
            <div className="flex justify-between text-sm mb-1">
              <span className="opacity-90">Date:</span>
              <span className="font-semibold">
                {prettySlotLabel(closest)}
              </span>
            </div>

            {/* Availability */}
            <div className="flex justify-between text-sm mb-3">
              <span className="opacity-90">Places left:</span>
              <span
                className={`font-bold ${
                  (closest?.capacity_left ?? Infinity) <= 3 ? "text-red-300" : "text-white"
                }`}
              >
                {closest?.capacity_left ?? "--"}
              </span>
            </div>

            {/* Booking Button */}
            <button
              onClick={() => {
                setDropUp(false);
                setShowPopup(true);
                handleQuickBook();
              }}
              className="w-full bg-white text-amber-700 
                         font-semibold py-2 rounded-lg shadow"
            >
              Book Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NearestDateMobile;
