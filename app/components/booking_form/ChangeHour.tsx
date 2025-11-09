import { usePersistentState } from "@/app/hooks/usePresistentState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/utils/supabase/client";
import { Pen } from "lucide-react"
import { useEffect, useState } from "react";
import ChangeCapacity from "./ChangeCapacity";

interface ChangeHourProps {
  editable: boolean;
  isoDate: string;
  hour: any;
  bookingDate?: any;
  capacityInit?: number;
  mode?: "create" | "edit";
  onClose?: () => void;
}

const ChangeHour = ({editable = false, isoDate, bookingDate, mode, capacityInit, hour, onClose} : ChangeHourProps) => {
  const supabase = createClient();
  //Set states for set hour, get available hours, set capacity
  const [availableHour, setAvailableHours] = useState<string[]>([]);
  const [isEditable, setIsEditable] = useState<boolean>(editable);
  const [capacity, setCapacity] = useState<any>(capacityInit);
  const [selectedHour, setSelectedHour] = usePersistentState<string>("booking-hour", "");
  console.log("selected hour last", selectedHour);
  console.log("hour mode", mode);
  console.log("On close?", onClose);


  useEffect(() => {
    if (mode === "edit" && bookingDate?.booking_hour) {
      setSelectedHour(bookingDate.booking_hour);
    } else {
      setSelectedHour(hour);
    }
  }, [mode, bookingDate?.booking_hour]);

  let initialTemp;
  if (mode==="edit"){
    initialTemp = bookingDate.booking_date;
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
    
  }, [initialTemp]);

   function handleHourChange(newHour: string) {
    setSelectedHour(newHour);
    setIsEditable(false);
  }
 
  return (
    <>
    { isEditable ?
        <Select  onValueChange={handleHourChange}>
          <SelectTrigger className="border-2 text-xl text-amber-50  rounded-lg focus:ring-2 focus:ring-amber-100">
            <SelectValue placeholder="Hours"/>
          </SelectTrigger>
          <SelectContent>
            {availableHour.map((h, i) => (
                <SelectItem key={i} value={h}>{h}</SelectItem>
            ))}
          </SelectContent>
        </Select> :
      <div className="flex justify-between items-center">
        <span>Hour:</span>
        <span>{selectedHour}</span>
        <Pen onClick={() => setIsEditable(true)}  size={16} className="cursor-pointer text-white/75 hover:text-amber-100" />
      </div>}
      {/*From previous steps we got Date, and pass capacity for ChangeCapacity component*/}
      <ChangeCapacity isoDate={isoDate} capacityInit={capacity} placesInit={bookingDate?.people_count} selectedHour={selectedHour} bookingDate={bookingDate} capacityLeft={capacityInit} mode={mode} onClose={onClose}/>
    </>
  )
}

export default ChangeHour;