import { usePersistentState } from "@/app/hooks/usePresistentState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/utils/supabase/client";
import { Pen } from "lucide-react"
import { useEffect, useState } from "react";
import ChangeCapacity from "./ChangeCapacity";
import { Booking} from "@/app/utils/types";

interface ChangeHourProps {
  editable: boolean;
  isoDate: string | undefined;
  hour: string | undefined;
  bookingDate?: Booking;
  capacityInit?: number;
  mode?: "create" | "edit";
  onClose?: () => void;
}

const ChangeHour = ({editable = false, isoDate, bookingDate, mode, capacityInit, hour, onClose} : ChangeHourProps) => {
  const supabase = createClient();
  //Set states for set hour, get available hours, set capacity
  const [availableHour, setAvailableHours] = useState<string[]>([]);
  const [isEditable, setIsEditable] = useState<boolean>(editable);
  const [capacity, setCapacity] = useState<number | undefined>(capacityInit);
  const [selectedHour, setSelectedHour] = usePersistentState<string | undefined>("booking-hour", "");

  useEffect(() => {
    if (mode === "edit" && bookingDate?.booking_hour) {
      setSelectedHour(bookingDate.booking_hour);
    } else {
      setSelectedHour(hour);
    }
  }, [mode, bookingDate?.booking_hour, hour, setSelectedHour]);

  let initialTemp;
  if (mode==="edit"){
    initialTemp = bookingDate?.booking_date;
  } else {
    initialTemp = isoDate;
  }

  useEffect(() => {
    const getHours = async () => {
      if (!initialTemp) {
        setAvailableHours([]);
        return;
      }

    const { data, error } = await supabase
      .from("slots")
      .select("slot_hour, capacity_left")
      .eq("slot_date", initialTemp)
      .gt("capacity_left", 0)
      .eq("disabled", false);

    if (error) {
      console.error("Error fetching hours:", error.message);
      return;
    }

    if (data) {
      const hours = data.map((item) => item.slot_hour);
      setAvailableHours(hours);
      setCapacity(data[0].capacity_left);
    } 
  };
  getHours();
    
  }, [initialTemp, supabase]);

   function handleHourChange(newHour: string) {
    setSelectedHour(newHour);
    setIsEditable(false);
  }

 return (
    <div className="flex flex-col gap-4 w-full text-base sm:text-lg">
      {isEditable ? (
        <Select onValueChange={handleHourChange}>
          <SelectTrigger className="border-2 border-white/30 bg-amber-900/70 text-white text-lg rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-200 hover:border-amber-100 w-full">
            <SelectValue placeholder="Select hour" />
          </SelectTrigger>
          <SelectContent className="bg-amber-900/95 border border-white/20 rounded-xl text-white max-h-60 overflow-y-auto">
            {availableHour.length > 0 ? (
              availableHour.map((h, i) => (
                <SelectItem
                  key={i}
                  value={h}
                  className="hover:bg-amber-700/60 text-lg sm:text-base"
                >
                  {h}
                </SelectItem>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-white/70">
                No available hours
              </div>
            )}
          </SelectContent>
        </Select>
      ) : (
        <div className="flex justify-between items-center w-full">
          <span className="text-white/90">Hour:</span>
          <span className="text-white/80">{selectedHour || "Not selected"}</span>
          <Pen
            onClick={() => setIsEditable(true)}
            size={18}
            className="cursor-pointer text-white/75 hover:text-amber-100 ml-2 sm:ml-4"
          />
        </div>
      )}

      {/* ✅ Pass data safely to capacity selector */}
      <ChangeCapacity
        isoDate={isoDate}
        capacityInit={capacity}
        placesInit={bookingDate?.people_count}
        selectedHour={selectedHour}
        bookingDate={bookingDate}
        capacityLeft={capacityInit}
        mode={mode}
        onClose={onClose}
      />
    </div>
  );
}

export default ChangeHour;

