"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Booking } from "@/app/utils/types";

export type SortOrder = "asc" | "desc";

export function useStats() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        let toDate = today.toISOString().split("T")[0];

        switch (dateFilter) {
          case "day":
            fromDate = toDate;
            break;
          case "week":
            fromDate = new Date(today.setDate(today.getDate() - 7))
              .toISOString()
              .split("T")[0];
            break;
          case "month":
            fromDate = new Date(today.setMonth(today.getMonth() - 1))
              .toISOString()
              .split("T")[0];
            break;
          case "year":
            fromDate = new Date(today.setFullYear(today.getFullYear() - 1))
              .toISOString()
              .split("T")[0];
            break;
          case "custom":
            if (customFrom && customTo) {
              fromDate = customFrom;
              toDate = customTo;
            }
            break;
        }

        let query = supabase
          .from("bookings")
          .select("*")
          .order("amount", { ascending: sortOrder === "asc" });

        if (fromDate) query = query.gte("booking_date", fromDate);
        if (toDate) query = query.lte("booking_date", toDate);
        if (privateOnly) query = query.eq("private_tour", true);

        const { data, error } = await query;

        if (error) throw error;
        setBookings((data ?? []) as Booking[]);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [dateFilter, customFrom, customTo, sortOrder, privateOnly, supabase]);

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

