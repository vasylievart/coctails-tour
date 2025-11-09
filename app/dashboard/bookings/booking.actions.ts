import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function getBookingByEmailAndPhone(email: string, phone: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("email", email)
    .eq("phone", phone)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching booking:", error.message);
    throw new Error("Failed to fetch booking");
  }

  return data || null;
}

export async function getCapacityLeftBySlotId(id: number) {
  const { data, error } = await supabase
    .from("slots")
    .select("capacity_left")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to find capacity:", error.message);
    throw new Error("Failed to fetch capacity");
  }

  return data?.capacity_left ?? null;
}

export async function cancelBooking () {

}

