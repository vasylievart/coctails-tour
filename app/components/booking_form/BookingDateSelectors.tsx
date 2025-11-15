"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useBookingData } from "./hooks/useBookingData";
import { useBookingState } from "./hooks/useBookingState";
import BookingHourSelector from "./BookingHourSelector";

const BookingDateSelectors = () => {
  //Get all states and static data from custom hook
  const {currentDay, currentMonth, currentYear, year, setYear, month, setMonth, day, setDay, months} = useBookingState();
  const {tempDate, setTempDate } = useBookingData(); 
  const [availableDays, setAvailableDays] = useState<number[]>([]);
  //set current day as day
  useEffect(() => {
    setDay(currentDay)
  },[currentDay]);
  //get available days, depend on current month
  useEffect(() => {
    if (month !== null) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      setAvailableDays(daysArray);
    } else {
      setAvailableDays([]);
    }
  }, [year, month]);
  //set specified day from available days
  useEffect(() => {
    if (day && month !== null && year) {
      const date = `${day}.${month + 1}.${year}`;
      setTempDate(date);
    }
  }, [day, month, year]);
  //format day format to "yyyy-MM-dd and use it as a prop for BookingHourSelect"
  const isoDate = tempDate
  .replace(/\./g, "-")
  .split("-")
  .reverse()
  .join("-")
  .trim();

  return (
    <>
      <div className="flex flex-col gap-6 items-center w-full px-2 sm:px-4 mb-6 z-50">
        {/*Select specified year*/}
        <div className="flex flex-wrap w-full gap-3 sm:gap-4 justify-center max-w-lg">
          <Select 
            value={String(year)} 
            onValueChange={(value) => setYear(Number(value))}
          >
            <SelectTrigger className="border-2 text-base sm:text-xl md:text-2xl text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 hover:text-amber-700 hover:border-amber-400 w-[30%] min-w-[90px]">
              <SelectValue placeholder="Years" />
            </SelectTrigger>
            <SelectContent>
              {[currentYear, currentYear + 1].map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
            </SelectContent>
          </Select>
          {/*Select specified month*/}
          <Select
            value={month !== null ? String(month) : ""}
            onValueChange={(value) => setMonth(value === "" ? null : Number(value))}
          >
            <SelectTrigger className="border-2 text-base sm:text-xl md:text-2xl text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 hover:text-amber-200 hover:border-amber-400 w-[35%] min-w-[110px]">
              <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Month"></SelectItem>
                {months.map((m, i) => {
                  const isPastMonth = year === currentYear && i < currentMonth;
                  return (
                    <SelectItem key={m} value={String(i)} disabled={isPastMonth} className={isPastMonth ? "opacity-40 cursor-not-allowed" : ""}>
                    {m}
                  </SelectItem>
                  ); 
                })}
              </SelectContent>
          </Select>
          {/*Select specified day from available days array */}
          <Select
            value={day !== null ? String(day) : ""}
            onValueChange={(value) => setDay(value === "" ? null : Number(value))}
            disabled = {!month}
          >
            <SelectTrigger className="border-2 text-base sm:text-xl md:text-2xl text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 hover:text-amber-200 hover:border-amber-400 w-[25%] min-w-[80px]">
              <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Day"></SelectItem>
                {availableDays.map((d) => {
                  const isPastDay = month === currentMonth && d < currentDay;
                  return (
                    <SelectItem key={d} value={String(d)} disabled={isPastDay} className={isPastDay ? "opacity-40 cursor-not-allowed" : ""}>
                    {d}
                  </SelectItem>
                  )
                  
                })}
              </SelectContent>
          </Select>
        </div>
        
        {day && (
          /*Pass selected date to BookingHourSelector component*/
         <BookingHourSelector isoDate={isoDate}/>
        )}
      </div>
    </>
  )
}

export default BookingDateSelectors;
