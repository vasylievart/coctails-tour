"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { createSlot, toggleSlot, updateSlotPrice } from "./slot.actions";

export default function SlotsPage() {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filterHour, setFilterHour] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc"); // date sort
  const [priceUpdate, setPriceUpdate] = useState<{ [key: string]: string }>({});
  const perPage = 20;
  const supabase = createClient();

  // Fetch Slots
  useEffect(() => {
    async function getSlots() {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from("slots")
          .select("*")
          .order("slot_date", { ascending: sortOrder === "asc" });

        if (filterHour !== "all") query = query.eq("slot_hour", filterHour);

        const from = (page - 1) * perPage;
        const to = from + perPage - 1;

        const { data, error } = await query.range(from, to);
        if (error) throw error;
        setSlots(data || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getSlots();
  }, [page, filterHour, sortOrder, supabase]);

  // Handlers
  const handlePriceChange = (id: string, value: string) => {
    setPriceUpdate((prev) => ({ ...prev, [id]: value }));
  };

  const handlePriceSubmit = async (id: string) => {
    const newPrice = priceUpdate[id];
    if (!newPrice) return;
    await updateSlotPrice(id, parseFloat(newPrice));
    alert("Price updated successfully");
    window.location.reload();
  };

  if (loading) return <p>Loading slots...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-6 ml-4">
      <h1 className="text-2xl font-bold">Slots Management</h1>

      {/* Create New Slot */}
      <form action={createSlot} className="flex flex-wrap gap-3 items-end">
        <Input name="slot_date" type="date" placeholder="Date" required />
        <Input name="slot_hour" type="time" placeholder="Hour" required />
        <Input name="capacity_total" type="number" placeholder="Total Capacity" required />
        <Input name="price" type="number" placeholder="Price" required />
        <Button type="submit">Create Slot</Button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={filterHour} onValueChange={setFilterHour}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by Hour" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="17:30:00">17:30</SelectItem>
            <SelectItem value="18:00:00">18:00</SelectItem>
            <SelectItem value="19:00:00">19:00</SelectItem>
            <SelectItem value="20:00:00">20:00</SelectItem>
            <SelectItem value="21:00:00">21:00</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest First</SelectItem>
            <SelectItem value="asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Slots Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Hour</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Price (€)</TableHead>
            <TableHead>Private</TableHead>
            <TableHead>Enabled</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slots.length > 0 ? (
            slots.map((slot) => (
              <TableRow key={slot.id}>
                <TableCell>{slot.id}</TableCell>
                <TableCell>{slot.slot_date}</TableCell>
                <TableCell>{slot.slot_hour}</TableCell>
                <TableCell>
                  {slot.capacity_left} / {slot.capacity_total}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      defaultValue={slot.price}
                      onChange={(e) => handlePriceChange(slot.id, e.target.value)}
                      className="w-24"
                    />
                    <Button size="sm" onClick={() => handlePriceSubmit(slot.id)}>
                      Update
                    </Button>
                  </div>
                </TableCell>
                {/*<TableCell>{slot.private ? "Yes" : "No"}</TableCell>*/}
                <TableCell>{slot.disabled ? "No" : "Yes"}</TableCell>
                <TableCell>
                  <form action={toggleSlot.bind(null, slot.id, slot.disabled)}>
                    <Button type="submit" variant={slot.disabled ? "default" : "destructive"}>
                      {slot.disabled ? "Enable" : "Disable"}
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8}>No slots found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </Button>
        <p>Page {page}</p>
        <Button onClick={() => setPage((p) => p + 1)} disabled={slots.length < perPage}>
          Next
        </Button>
      </div>
    </div>
  );
}
