import { createClient } from "@/utils/supabase/client";

 const today = new Date().toISOString().split('T')[0];

export async function getDailyStats() {
  const supabase = createClient();
  const { data: bookings } = await supabase.from('bookings').select('booking_date, amount').eq("booking_date", today);
  console.log("Bookings", bookings)
  const dailyStats = bookings?.reduce((acc: { [key: string]: number }, b) => {
    acc[b.booking_date] = (acc[b.booking_date] || 0) + b.amount;
    return acc;
  }, {}) || {};
  console.log("Daily stats", dailyStats);

  return Object.entries(dailyStats).map(([date, amount]) => ({ date, amount }));
}

