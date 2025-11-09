"use server";

import { createClient } from "@/utils/supabase/client";

interface Booking {
  id: string;
  booking_date: string;
  booking_hour: string;
  private: boolean;
  amount: number;
  comment?: string;
  full_name?: string;
}

interface Slot {
  id?: number;
  slot_date?: string;
  slot_hour: string;
  capacity_left: number;
  capacity_total: number;
  disabled?: boolean;
}

export interface DashboardData {
  bookingCount: number;
  availablePlaces: number;
  totalPlaces: number;
  amount: number;
  allSlotData: Slot[];
  privateTours: Booking[];
  allBookings: Booking[];
  allSlotsAmount: { amount: number; booking_hour: string }[];
}

export async function getHomeData(): Promise<DashboardData> {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  const [bookingsRes, slotsRes] = await Promise.all([
    supabase.from("bookings").select("*").eq("booking_date", today),
    supabase
      .from("slots")
      .select("capacity_left, capacity_total, slot_hour")
      .eq("slot_date", today)
      .eq("disabled", false),
  ]);

  if (bookingsRes.error) throw new Error(bookingsRes.error.message);
  if (slotsRes.error) throw new Error(slotsRes.error.message);

  const bookings = bookingsRes.data as Booking[];
  const slots = slotsRes.data as Slot[];

  const bookingCount = bookings.length;
  const availablePlaces = slots.reduce((acc, s) => acc + s.capacity_left, 0);
  const totalPlaces = slots.reduce((acc, s) => acc + s.capacity_total, 0);
  const amount = bookings.reduce((acc, b) => acc + (b.amount || 0), 0);

  const privateTours = bookings
    .filter((b) => b.private)
    .sort(
      (a, b) =>
        new Date(b.booking_date).getTime() -
        new Date(a.booking_date).getTime()
    )
    .slice(0, 5);

  const allSlotsAmount = bookings.map((b) => ({
    booking_hour: b.booking_hour,
    amount: b.amount,
  }));
  console.log("All slots amount", allSlotsAmount)
  console.log("Booking count", bookingCount);

  return {
    bookingCount,
    availablePlaces,
    totalPlaces,
    amount,
    allSlotData: slots,
    privateTours,
    allBookings: bookings,
    allSlotsAmount,
  };
}

