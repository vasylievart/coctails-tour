import { useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

export default function BookingChecker() {
  useEffect(() => {
    const checker = async () => {
      try {
        const { data, error } = await supabase.rpc("book_slot_atomic", {
          p_slot_date: formattedDate,
          p_slot_hour: formattedTime,
          p_people_count: validatedData.people_count || 1, // adjust to your schema
          p_full_name: validatedData.fullName,
          p_email: validatedData.email,
          p_phone: validatedData.phone,
          p_comment: validatedData.comment || "",
        });

        if (error) {
          console.error("RPC error:", error.message);
          return;
        }

        if (!data.success) {
          console.warn("Booking failed:", data.error);
        } else {
          console.log(`✅ Booking successful, ${data.remaining} places left`);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    checker();
  }, []); // 👈 run only once when component mounts

  return null;
}
