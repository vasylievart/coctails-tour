import { usePersistentState } from "@/app/hooks/usePresistentState";
import { listOfMonths } from "@/app/utils/months";
import { countryPhoneCodes } from "@/app/utils/phone_codes";

export const useBookingState = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const [year, setYear] = usePersistentState<number>("booking-year", currentYear);
  const [month, setMonth] = usePersistentState<number | null>("booking-month", currentMonth);
  const [day, setDay] = usePersistentState<number | null>("booking-day", currentDay);

  const months = listOfMonths;
  const isoAndCode = countryPhoneCodes;

    const [formData, setFormData] = usePersistentState("booking-form", {
    full_name: "",
    email: "",
    country_code: "",
    phone: "",
    comment: "",
  });

  return {currentDay, currentMonth, currentYear, year, setYear, month, setMonth, day, setDay, formData, setFormData, months, isoAndCode }
}