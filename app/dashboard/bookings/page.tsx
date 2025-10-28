"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getBookings() {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("booking_date", { ascending: false });

      if (error) {
        console.error(error);
        setError(error.message);
      } else {
        setBookings(data || []);
      }
      setLoading(false);
    }

    getBookings();
  }, [supabase]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading bookings: {error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bookings</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Hour</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.booking_date}</TableCell>
                <TableCell>{booking.booking_hour}</TableCell>
                <TableCell>{booking.people_count}</TableCell>
                <TableCell>{booking.full_name}</TableCell>
                <TableCell>{booking.email}</TableCell>
                <TableCell>{booking.country_code}</TableCell>
                <TableCell>{booking.phone}</TableCell>
                <TableCell>{booking.comment}</TableCell>
                <TableCell>{booking.created_at}</TableCell>

              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No bookings.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
