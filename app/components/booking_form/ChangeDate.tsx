import { format } from "date-fns";
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css";
import { useBookingState } from "./hooks/useBookingState";

interface ChangeDateProps {
  rowDate: string;
  bookingDate?: any;
  mode?: "create" | "edit";
}

const ChangeDate = ({rowDate, bookingDate, mode} : ChangeDateProps) => {
  console.log("date component mode:", mode);

  let initialTemp;
  if (mode === "edit") {
    initialTemp = bookingDate.booking_date;
  } else {
    initialTemp = rowDate;
  }

  const {setDay, setMonth, setYear} = useBookingState();
  const [tempDate, setTempDate] = useState<any>(initialTemp);
  
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const handleCalendarSelect = (newDate: Date | undefined) => {
      if (!newDate) return;
    
      const d = newDate.getDate();
      const m = newDate.getMonth();
      const y = newDate.getFullYear();
    
      setSelectedDate(newDate);
      setTempDate(format(newDate, "yyyy-MM-dd"));
      setDay(d);
      setMonth(m);
      setYear(y);
    
      setShowCalendar(false);
      };

  return (
    <div className="relative flex justify-between items-center">
      <span>Date:</span>
      <span>{tempDate}</span>
      <CalendarIcon
        size={16}
        className="cursor-pointer text-white/75 hover:text-amber-100"
        onClick={() => setShowCalendar(!showCalendar)}
      />
      { showCalendar && (
        <div className="absolute bg-amber-900/80 border-2 text-2xl text-white p-4 rounded-xl shadow-sm ">
          <DayPicker
            mode="single"
            disabled={{before: new Date()}}
            selected={selectedDate}
            onSelect={handleCalendarSelect}
            classNames={{
              today: "bg-amber-700/60",
              selected: `bg-amber-500/80  text-white rounded-full`,
              chevron: "fill-white"
            }}
          />
        </div>
        )
      }
    </div>
  )
}

export default ChangeDate;