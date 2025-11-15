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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Pagination
  const [page, setPage] = useState(1);
  const perPage = 20;

  // 🔹 Filters
  const [dateFilter, setDateFilter] = useState("week"); // day | week | month | year | custom
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // amount sorting
  const [privateOnly, setPrivateOnly] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [activeToure, setActiveTour] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function getBookings() {
      setLoading(true);
      setError(null);

      try {
        // 🧭 Calculate date range based on filter
        const today = new Date();
        let fromDate: string | null = null;
        let toDate: string = today.toISOString().split("T")[0];

        if (dateFilter === "day") {
          fromDate = toDate;
        } else if (dateFilter === "week") {
          const lastWeek = new Date(today);
          lastWeek.setDate(today.getDate() - 7);
          fromDate = lastWeek.toISOString().split("T")[0];
        } else if (dateFilter === "month") {
          const lastMonth = new Date(today);
          lastMonth.setMonth(today.getMonth() - 1);
          fromDate = lastMonth.toISOString().split("T")[0];
        } else if (dateFilter === "year") {
          const lastYear = new Date(today);
          lastYear.setFullYear(today.getFullYear() - 1);
          fromDate = lastYear.toISOString().split("T")[0];
        } else if (dateFilter === "custom" && customFrom && customTo) {
          fromDate = customFrom;
          toDate = customTo;
        }

        // ⚡ Build Supabase query
        let query = supabase
          .from("bookings")
          .select("*")
          .order("amount", { ascending: sortOrder === "asc" });

        if (fromDate) query = query.gte("booking_date", fromDate);
        if (toDate) query = query.lte("booking_date", toDate);
        if (privateOnly) query = query.eq("private_tour", true);
        if (canceled) query = query.eq("canceled", true);
        if (activeToure) query = query.eq("active", true) ;

        // 🧾 Pagination logic
        const from = (page - 1) * perPage;
        const to = from + perPage - 1;

        const { data, error } = await query.range(from, to);

        if (error) throw error;
        setBookings(data || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getBookings();
  }, [page, dateFilter, customFrom, customTo, sortOrder, privateOnly, canceled, activeToure, supabase]);

  // 🧮 Pagination controls
  const handleNext = () => setPage((p) => p + 1);
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));

  // 🧰 UI
  if (loading) return <p className="ml-4">Loading...</p>;
  if (error) return <p className="text-red-500 ml-4">Error: {error}</p>;

  return (
    <div className="space-y-6 ml-4">
      <h1 className="text-2xl font-bold">Bookings</h1>

      {/* 🔍 Filter Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Date Filter */}
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
            <SelectItem value="custom">Custom Period</SelectItem>
          </SelectContent>
        </Select>

        {/* Custom Range */}
        {dateFilter === "custom" && (
          <div className="flex gap-2 items-center">
            <Input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              placeholder="From"
            />
            <Input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              placeholder="To"
            />
          </div>
        )}

        {/* Sort by amount */}
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by Amount" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Amount ↑</SelectItem>
            <SelectItem value="desc">Amount ↓</SelectItem>
          </SelectContent>
        </Select>

        {/* Private filter */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={privateOnly}
            onChange={(e) => setPrivateOnly(e.target.checked)}
          />
          <span>Private Tours Only</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={canceled}
            onChange={(e) => setCanceled(e.target.checked)}
          />
          <span className="text-red-900 bg-red-200 rounded-sm px-1">Canceled</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={activeToure}
            onChange={(e) => setActiveTour(e.target.checked)}
          />
          <span className="text-green-950 bg-green-200 rounded-sm px-1">Active</span>
        </label>
      </div>

      {/* 🧾 Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Hour</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>People</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Private</TableHead>
            <TableHead>Canceled</TableHead>
            <TableHead>Active</TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.id}</TableCell>
                <TableCell>{b.booking_date}</TableCell>
                <TableCell>{b.booking_hour}</TableCell>
                <TableCell>{b.full_name}</TableCell>
                <TableCell>{b.email}</TableCell>
                <TableCell>{b.people_count}</TableCell>
                <TableCell>{b.amount}</TableCell>
                <TableCell>{b.private_tour ? "Yes" : "No"}</TableCell>
                <TableCell>{b.canceled ? "Yes" : "No"}</TableCell>
                <TableCell>{b.active ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8}>No bookings found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button onClick={handlePrev} disabled={page === 1}>
          Previous
        </Button>
        <p>Page {page}</p>
        <Button onClick={handleNext} disabled={bookings.length < perPage}>
          Next
        </Button>
      </div>
    </div>
  );
}

