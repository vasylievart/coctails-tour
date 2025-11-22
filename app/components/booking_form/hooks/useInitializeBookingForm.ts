import { useEffect } from "react";
import { Booking, BookingForm } from "@/app/utils/types";

interface UseInitializeBookingFormProps {
  bookingData?: Booking | null;
  setFormData: (value: BookingForm) => void;
  setPrivateTour: (value: boolean) => void;
}

export function useInitializeBookingForm({
  bookingData,
  setFormData,
  setPrivateTour,
}: UseInitializeBookingFormProps) {

  useEffect(() => {
    if (bookingData)  {
      setFormData({
      full_name: bookingData.full_name,
      email: bookingData.email,
      phone: bookingData.phone,
      country_code: bookingData.country_code,
      comment: bookingData.comment || "",
    });

    setPrivateTour(bookingData.private_tour);
    }

  }, [bookingData, setFormData]);
}
