import { usePersistentState } from "@/app/hooks/usePresistentState";
import { createClient } from "@/utils/supabase/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useBookingState } from "./useBookingState";
import { countryPhoneCodes } from "@/app/utils/phone_codes";
import { format } from "date-fns/format";

export const useBookingData = () => {
  // ✔ supabase is stable, so it's safe to ignore as dependency
  const supabase = useMemo(() => createClient(), []);

  const { day, setDay, month, setMonth, year, setYear } = useBookingState();

  const [availableHour, setAvailableHours] = useState<string[]>([]);
  const [selectedHour, setSelectedHour] = usePersistentState<string | undefined>("booking-hour", undefined);
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

  // -----------------------------
  // SET TEMP DATE WHEN DAY/MONTH/YEAR CHANGE
  // -----------------------------
  useEffect(() => {
    if (day && month !== null && year) {
      const date = `${day}.${month + 1}.${year}`;
      setTempDate(date);
    }
  }, [day, month, year]);

  // -----------------------------
  // FETCH HOURS
  // -----------------------------
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
        setAvailableHours(data.map((item) => item.slot_hour));
      }
    };

    getHours();
  }, [isoDate, supabase]);

  // -----------------------------
  // FETCH CAPACITY FOR SELECTED HOUR
  // -----------------------------
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
  }, [isoDate, selectedHour, supabase, setCapacity]);

  // -----------------------------
  // CREATE PLACES ARRAY
  // -----------------------------
  useMemo(() => {
    const arr = Array.from({ length: capacity }, (_, i) => i + 1);
    setAvalablePlaces(arr);
  }, [capacity, setAvalablePlaces]);

  // -----------------------------
  // SELECT HOUR
  // -----------------------------
  const handleSelectHour = useCallback(
    (hour: string) => {
      setSelectedHour(hour);
      setShowPopup(false);
    },
    [setSelectedHour]
  );

  const handleBook = useCallback(() => {
    if (selectedHour) setShowPopup(true);
  }, [selectedHour]);

  const handleHourChange = (newHour: string) => {
    setSelectedHour(newHour);
    setIsEditable(false);
  };

  // -----------------------------
  // SELECT DATE FROM CALENDAR
  // -----------------------------
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

  return {
    availableHour,
    setAvailableHours,
    selectedHour,
    setSelectedHour: handleSelectHour,
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
    handleBook,
  };
};

