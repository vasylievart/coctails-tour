import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { bookingSchema } from "@/lib/validation";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useBookingState } from "./hooks/useBookingState";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ReusablePopupProps {
  open?: boolean;
  bookingData?: any; 
  selectedDate?: any;
  bookedPlaces?: number;
  isoDate?: string;
  selectedHour?: any;
  capacity_left: number;
  mode?: "create" | "edit";
  className?: string;
  onClose?: () => void;
}

const BookingForm = ({bookingData,selectedDate, bookedPlaces, selectedHour, open, onClose, isoDate, mode }: ReusablePopupProps) => {
  const supabase = createClient();
  //Set states for form data
  const {formData, setFormData, isoAndCode} = useBookingState();
  const [showPopup, setShowPopup] = useState<boolean | undefined>(open);
  const [privateTour, setPrivateTour] = useState<boolean>(false);

  useEffect(() => {
    if (bookingData) {
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

  const handleCancel = async (e: any) => {
    e.preventDefault();
    const { data, error } = await supabase.rpc("cancel_booking", {
      p_booking_id: bookingData.id,
    });

    if (error || !data?.success) {
      console.error(error);
      toast.error(data?.error || "Failed to cancel booking");
      return;
    }

    toast.success(data.message || "Booking canceled successfully!");
    setShowPopup(false);
    onClose?.();
    localStorage.clear();
  }

  const handleConfirm = async (e: any) => {
    e.preventDefault();

    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    const validatedData = result.data;

    try {
      if (mode === "edit" && bookingData?.id) {   
        const formattedDate = selectedDate 
        ? format(selectedDate, "yyyy-MM-dd") 
        : bookingData.booking_date;
        await supabase.rpc("update_booking_with_slot", {
          p_booking_id: bookingData.id,
          p_full_name: validatedData.full_name,
          p_email: validatedData.email,
          p_phone: validatedData.phone,
          p_country_code: validatedData.country_code,
          p_people_count: bookedPlaces || bookingData.people_count,
          p_booking_date: formattedDate,
          p_booking_hour: selectedHour || bookingData.booking_hour,
          p_comment: validatedData.comment,
          p_private_tour: privateTour
        });

        toast.success("Booking updated successfully!");
        setShowPopup(false);
        setFormData({
          full_name: "",
          email: "",
          country_code: "",
          phone: "",
          comment: "",
        });
        localStorage.removeItem("booking-form");
        onClose?.();
      } else {
        // 🧩 Create new booking
        const { data, error } = await supabase.rpc("book_slot_atomic", {
          p_comment: validatedData.comment,
          p_country_code: validatedData.country_code,
          p_email: validatedData.email,
          p_full_name: validatedData.full_name,
          p_people_count: bookedPlaces,
          p_phone: validatedData.phone,
          p_slot_date: isoDate,
          p_slot_hour: selectedHour,
          p_private_tour: privateTour
        });

        if (error || !data?.success) {
          console.error(error);
          toast.error(data?.error || "Failed to create booking");
          return;
        }

        toast.success(data.message || "Booking created successfully!");
        setShowPopup(false);
        onClose?.();
        localStorage.clear();
  
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };
  
      return (
      <>
        <div className="space-y-3 mb-6 w-full max-w-md mx-auto px-0 sm:px-0">
          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="
              w-full border border-white/30 bg-white/10 text-white 
              placeholder-white/60 p-2 rounded-lg 
              focus:ring-2 focus:ring-amber-200 focus:outline-none 
              transition text-base sm:text-lg
            "
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="
              w-full border border-white/30 bg-white/10 text-white 
              placeholder-white/60 p-2 rounded-lg 
              focus:ring-2 focus:ring-amber-200 focus:outline-none 
              transition text-base sm:text-lg
            "
          />

          {/* Phone Selector + Input */}
          <div className="flex flex-row sm:flex-row gap-2">
            <Select
              onValueChange={(value) => setFormData({ ...formData, country_code: value })}
            >
              <SelectTrigger className="
                sm:w-32 border border-white/30 bg-white/10 text-amber-50 
                text-base sm:text-lg rounded-lg focus:ring-2 focus:ring-amber-200
              ">
                <SelectValue placeholder="ES +34" />
              </SelectTrigger>
              <SelectContent className="bg-amber-900/95 border border-white/20 rounded-xl text-white max-h-60 overflow-y-auto">
                {isoAndCode.map((c, i) => (
                  <SelectItem key={i} value={c.code}>
                    {c.iso} {c.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="
                w-full border border-white/30 bg-white/10 text-white 
                placeholder-white/60 p-2  rounded-lg 
                focus:ring-2 focus:ring-amber-200 focus:outline-none 
                transition text-base sm:text-lg
              "
            />
          </div>

          {/* Comment */}
          <textarea
            placeholder="Comment (optional)"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows={3}
            className="
              w-full border border-white/30 bg-white/10 text-white 
              placeholder-white/60 p-3 rounded-lg 
              focus:ring-2 focus:ring-amber-200 focus:outline-none 
              transition text-base sm:text-lg resize-none
            "
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-row sm:flex-row justify-between gap-3 w-full max-w-md mx-auto px-2 sm:px-0">
          <button
            onClick={(e) => handleConfirm(e)}
            className="
              sm:w-auto px-6 py-3 border-2 text-white text-base sm:text-lg 
              rounded-xl focus:ring-2 focus:ring-amber-200 
              hover:text-amber-100 hover:bg-amber-800 hover:border-amber-100 
              transition font-semibold shadow-md
            "
          >
            {mode === "edit" ? "Update" : "Confirm Booking"}
          </button>

          {mode === "edit" && (
            <button
              onClick={(e) => handleCancel(e)}
              className="
                sm:w-auto px-6 py-3 border-2 text-red-300 border-red-300 
                text-base sm:text-lg rounded-xl 
                focus:ring-2 focus:ring-red-400 hover:text-amber-100 
                hover:bg-amber-800 hover:border-amber-100 
                transition font-semibold shadow-md
              "
            >
              Cancel
            </button>
          )}
        </div>

        {/* Private Tour */}
        <div className="flex items-center justify-end gap-3 mt-5 w-full max-w-md mx-auto px-2 sm:px-0">
          <Label htmlFor="private" className="text-white/80 text-sm sm:text-base">
            Private
          </Label>
          <Checkbox
            checked={privateTour}
            onCheckedChange={(checked) => setPrivateTour(Boolean(checked))}
            id="private"
          />
        </div>
      </>
    );

}

export default BookingForm;