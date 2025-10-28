"use client"
// app/dashboard/slots/page.tsx
// (Slots page - manage slots: list, create, enable/disable)
// Use server actions for create/disable. Assume form components from shadcn.
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { createSlot, toggleSlot } from "./slot.actions";
import { createClient } from "@/utils/supabase/client";


export default function SlotsPage() {
  const [slots, setSlots] = useState<any[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getBookings() {
      const { data, error } = await supabase
        .from("slots")
        .select("*")
        .order("slot_date", { ascending: false });

      if (error) {
        console.error(error);
        setError(error.message);
      } else {
        setSlots(data || []);
      }
      setLoading(false);
    }

    getBookings();
  }, [supabase]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading bookings: {error}</p>;


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Slots Management</h1>
      <form action={createSlot} className="space-y-4">
        <Input name="date" type="date" placeholder="Date" required />
        <Input name="capacity_total" type="number" placeholder="Total Capacity" required />
        <Button type="submit">Create New Slot</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Capacity Left / Total</TableHead>
            <TableHead>Enabled</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slots?.map((slot) => (
            <TableRow key={slot.id}>
              <TableCell>{slot.id}</TableCell>
              <TableCell>{slot.slot_date}</TableCell>
              <TableCell>{slot.slot_hour}</TableCell>
              <TableCell>{slot.capacity_left} / {slot.capacity_total}</TableCell>
              <TableCell>{slot.disabled ? 'No' : 'Yes'}</TableCell>
              <TableCell>
                <form action={toggleSlot.bind(null, slot.id, slot.disabled)}>
                  <Button type="submit" variant={slot.enabled ? "destructive" : "default"}>
                    {slot.disabled ? 'Enable' : 'Disable'}
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          )) || <TableRow><TableCell colSpan={5}>No slots.</TableCell></TableRow>}
        </TableBody>
      </Table>
    </div>
  );
}