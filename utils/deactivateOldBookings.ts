// utils/deactivateOldBookings.ts
"use server"

import { createClient } from "./supabase/client";



export async function deactivateOldBookings() {
  const supabase = createClient();

  const { error } = await supabase.rpc("deactivate_old_bookings");

  if (error) {
    console.error("❌ Failed to deactivate old bookings:", error);
    return { success: false, error };
  }

  console.log("✅ Old bookings deactivated successfully");
  return { success: true };
}
