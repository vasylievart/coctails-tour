"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client";
import Link from "next/link"
import { useEffect, useState } from "react";
import { signOut } from "@/app/login/actions";

export default function HomePage() {
  const [bookingCount, setBookingCount] = useState<number>();
  const [availablePlaces, setAvailablePlaces] = useState<number>();
  const [totalPlaces, setTotalPlaces] = useState<number>();
  const [privateTours, setPrivateTours] = useState<any[] | null>([]);
  const [amount, setAmount] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];

  


    useEffect(() => {
      async function getBookingToday() {
        const { data: bookingsToday, error: btError } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_date', today);

        console.log("Bookings today - success!", bookingsToday);
        if(error) return console.error("Failed fetch todays booking", btError);
        const bookingsCount = bookingsToday?.length || 0;
        setBookingCount(bookingsCount);

        const { data: slotsToday, error: stError } = await supabase
          .from('slots')
          .select('capacity_left, capacity_total')
          .eq('slot_date', today)
          .eq('disabled', false); 

          console.log("Today slots capacity", slotsToday);

          if (!slotsToday) {
            console.error("Failed to fetch slots", stError);
          }

        let availableCapacity = 0;
        let totalCapacity = 0;
        if (slotsToday) {
          availableCapacity = slotsToday.reduce((acc, s) => acc + s.capacity_left, 0);
          totalCapacity = slotsToday.reduce((acc, s) => acc + s.capacity_total, 0);
        }
        setAvailablePlaces(availableCapacity);
        setTotalPlaces(totalCapacity);

        const { data: privateBookings, error: pbError } = await supabase
          .from('bookings')
          .select('*')
          .eq('private', true)
          .order('created_at', { ascending: false })
          .limit(5);

          if (!privateBookings) {
            console.error("Failed to fetch private bookings", pbError);
          }
          
          console.log("Private booking", privateBookings)
          setPrivateTours(privateBookings);

        const { data: amountsToday, error: atError } = await supabase
          .from('bookings')
          .select('amount')
          .eq('booking_date', today);

          console.log("Today amount", amountsToday);
        
        if (!amountsToday) {
          console.error("Failed to fetch amount", atError);
        }

        const totalAmount = amountsToday?.reduce((acc, b) => acc + (b.amount || 0), 0) || 0;
        console.log("Total amount", totalAmount)
        setAmount(totalAmount);

        setLoading(false);

      }
      getBookingToday();
    }, [supabase]);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading bookings: {error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Home</h1>
        <form >
          <button type="submit" onClick={signOut} className="bg-red-500 text-white px-4 py-2 rounded">Sign Out</button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer">
          <CardHeader>
            <CardTitle>Bookings Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{bookingCount}</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/bookings">View All Bookings</Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Available Slots Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{availablePlaces} / {totalPlaces}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Private Bookings Mailbox</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {privateTours && privateTours.length > 0 ? (
                privateTours.map((tour) => (
                  <li key={tour.id} className="border-b pb-2">
                    <p>{tour.comment || 'No details'}</p>
                    <p className="text-sm text-gray-500">Booked on: {tour.booking_date}</p>
                  </li>
                ))
              ) : (
                <p>No private bookings.</p>
              )}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Amount Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${amount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}