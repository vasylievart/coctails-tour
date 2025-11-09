import { usePersistentState } from "@/app/hooks/usePresistentState";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useMemo, useState } from "react";
import { useBookingState } from "./useBookingState";
import { countryPhoneCodes } from "@/app/utils/phone_codes";
import { format } from "date-fns/format";

export const useBookingData = () => {
  const supabase = createClient();
  const { day, setDay, month, setMonth, year, setYear } = useBookingState();
  
  const [availableHour, setAvailableHours] = useState<string[]>([]);
  const [selectedHour, setSelectedHour] = usePersistentState<string>("booking-hour", "");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showPopup, setShowPopup] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [capacity, setCapacity] = usePersistentState<number>("people-quantity", 0);
  const [tempDate, setTempDate] = useState<string>("");
  const [places, setAvalablePlaces] = usePersistentState<number[]>("booking-places", [0]);
  const [bookedPlaces, setBookedPlaces] = usePersistentState<number>("booked-places", 0);


  const isoAndCode = countryPhoneCodes;
  const price = 150;
  const totalAmount = price * bookedPlaces;
  
  const isoDate = tempDate
  .replace(/\./g, "-")
  .split("-")
  .reverse()
  .join("-")
  .trim();
  
   useEffect(() => {
      if (day && month !== null && year) {
        const date = `${day}.${month + 1}.${year}`;
        setTempDate(date);
      }
    }, [day, month, year]);

  // 🟢 Fetch available hours when date changes
  useEffect(() => {
    const getHours = async () => {
      if (!isoDate) {
        setAvailableHours([]);
        return;
      }

      const { data, error } = await supabase
        .from("slots")
        .select("slot_hour, capacity_left")
        .eq("slot_date", isoDate)
        .gt("capacity_left", 0)
        .eq("disabled", false);

      if (error) {
        console.error("Error fetching hours:", error.message);
        return;
      }

      if (data) {
        const hours = data.map((item) => item.slot_hour);
        setAvailableHours(hours);
      }
    };

    getHours();
  }, [isoDate]);

  // 🟢 Update capacity whenever hour changes
  useEffect(() => {
    if (!isoDate || !selectedHour) return;

    const getCapacity = async () => {
      const { data, error } = await supabase
        .from("slots")
        .select("capacity_left")
        .eq("slot_date", isoDate)
        .eq("slot_hour", selectedHour)
        .single();

      if (!error && data) setCapacity(data.capacity_left);
    };

    getCapacity();
  }, [isoDate, selectedHour]);

  useMemo(() => {
      const createPlaces = () => {
      const pl = [];
      for ( let i = 1; i<capacity+1; i++ ) {
        pl.push(i);
      }
      setAvalablePlaces(pl)
      return places;
    }
    createPlaces();
    },[capacity]);

  const handleBook = () => {
    if (!day || !selectedHour) return;
    setShowPopup(true);
  };

  function handleHourChange(newHour: string) {
  setSelectedHour(newHour);
  setIsEditable(false);
  }


  const handleCalendarSelect = (newDate: Date | undefined) => {
    if (!newDate) return;
  
    const d = newDate.getDate();
    const m = newDate.getMonth();
    const y = newDate.getFullYear();
  
    setSelectedDate(newDate);
    setTempDate(format(newDate, "dd.MM.yyyy"));
    setDay(d);
    setMonth(m);
    setYear(y);
  
    setShowCalendar(false);
    setIsEditable(false);
    };

  

    console.log("Server show popup", showPopup);
  

  return {
    availableHour,
    setAvailableHours,
    selectedHour,
    setSelectedHour,
    capacity,
    setCapacity,
    showPopup,
    setShowPopup,
    tempDate,
    setTempDate,
    isoAndCode,
    isEditable,
    setIsEditable,
    showCalendar,
    selectedDate,
    setShowCalendar,
    handleCalendarSelect,
    places,
    setAvalablePlaces,
    handleHourChange,
    totalAmount,
    bookedPlaces,
    setBookedPlaces,
    isoDate,
    handleBook
  };
};
