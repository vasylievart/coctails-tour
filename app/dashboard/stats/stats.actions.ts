"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type DateFilter = "day" | "week" | "month" | "year" | "custom";
type SortOrder = "asc" | "desc";

export function useStats() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [dateFilter, setDateFilter] = useState("week");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [privateOnly, setPrivateOnly] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setError(null);

      try {
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

        let query = supabase
          .from("bookings")
          .select("*")
          .order("amount", { ascending: sortOrder === "asc" });

        if (fromDate) query = query.gte("booking_date", fromDate);
        if (toDate) query = query.lte("booking_date", toDate);
        if (privateOnly) query = query.eq("private", true);

        const { data, error } = await query;
        console.log(data);

        if (error) throw error;
        setBookings(data || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [dateFilter, customFrom, customTo, sortOrder, privateOnly]);

  return {
    bookings,
    loading,
    error,
    dateFilter,
    setDateFilter,
    customFrom,
    setCustomFrom,
    customTo,
    setCustomTo,
    sortOrder,
    setSortOrder,
    privateOnly,
    setPrivateOnly,
  };
}
