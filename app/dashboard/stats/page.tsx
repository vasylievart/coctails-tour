/*"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useStats } from "./stats.actions";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countryPhoneCodes as phone } from "@/app/utils/phone_codes";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c43", "#0088FE", "#FF8042"];

export default function StatsPage() {
  const {
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
  } = useStats();
 

  if (loading) return <p className="p-4 ml-4">Loading stats…</p>;
  if (error) return <p className="p-4 text-red-600 ml-4">Error: {error}</p>;
  if (!bookings.length) return <p className="p-4 ml-4">No bookings found.</p>;

  const slotData = aggregateByKey(bookings, "booking_hour");
  const countryData = aggregateByKey(bookings, "country_code");

  
  function mapCountryCodesToNames(countryData: { name: string; count: number }[]) {
    return countryData.map((item) => {
      const match = phone.find((p) => p.code === item.name);
      return {
        name: match ? match.name : item.name, 
        count: item.count,
      };
    });
  }

  const countryDataName = mapCountryCodesToNames(countryData); 

  return (
    <div className="space-y-12 p-4">
      <h1 className="text-3xl font-bold">Statistics Dashboard</h1>

      <div className="flex items-center gap-4 mb-4">
        <label>Filter by period:</label>
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
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-2">Revenue Over Time</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="booking_date" />
              <YAxis />
              <Tooltip formatter={(v) => `€${Number(v).toFixed(2)}`} />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" name="Revenue (€)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Slot Popularity</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={slotData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>


      <section>
        <h2 className="text-xl font-semibold mb-4">Bookings by Country</h2>
        <div className="flex justify-center w-[600px]">
          <ResponsiveContainer width="100%" height={600}>
            <PieChart>
              <Pie
                data={countryDataName}
                dataKey="count"
                nameKey="name"
                outerRadius={150}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {countryDataName.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

function aggregateByKey(data: any[], key: string) {
  const map: Record<string, number> = {};
  for (const item of data) {
    const k = item[key];
    if (!k) continue;
    map[k] = (map[k] || 0) + 1;
  }
  return Object.entries(map).map(([name, count]) => ({ name, count }));
}
*/
"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { SortOrder, useStats } from "./stats.actions";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { countryPhoneCodes as phone } from "@/app/utils/phone_codes";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowDown01, ArrowDown10 } from "lucide-react";


const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c43", "#0088FE", "#FF8042"];

export default function StatsPage() {
  const {
    bookings,
    loading,
    error,
    dateFilter,
    setDateFilter,
    customFrom,
    setCustomFrom,
    customTo,
    setCustomTo,
    privateOnly,
    setPrivateOnly,
    sortOrder,
    setSortOrder
  } = useStats();

  if (loading) return <p className="p-4 ml-4">Loading stats…</p>;
  if (error) return <p className="p-4 text-red-600 ml-4">Error: {error}</p>;
  if (!bookings.length) return <p className="p-4 ml-4">No bookings found.</p>;

  const slotData = aggregateByKey(bookings, "booking_hour");
  const countryData = aggregateByKey(bookings, "country_code");
  const countryDataName = mapCountryCodesToNames(countryData);

  return (
    <div className="space-y-12 p-4">
      <h1 className="text-3xl font-bold">Statistics Dashboard</h1>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <label>Filter by period:</label>

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

        {dateFilter === "custom" && (
          <div className="flex gap-2 items-center">
            <Input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
            />
            <Input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
            />
          </div>
        )}

        <Select value={sortOrder} onValueChange={(value: SortOrder) => setSortOrder(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Sort by Increment<ArrowDown01 /></SelectItem>
            <SelectItem value="desc">Sort by descrement<ArrowDown10 /></SelectItem>
          </SelectContent>
        </Select>

        <Label htmlFor="private" className="text-sm sm:text-base">
          Private Tours
        </Label>
        <Checkbox
          checked={privateOnly}
          onCheckedChange={(checked) => setPrivateOnly(Boolean(checked))}
          id="private"
        />
      </div>

      {/* Revenue Chart */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Revenue Over Time</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="booking_date" />
              <YAxis />
              <Tooltip formatter={(v) => `€${Number(v).toFixed(2)}`} />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" name="Revenue (€)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Slot Popularity */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Slot Popularity</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={slotData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Country Distribution */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Bookings by Country</h2>
        <div className="flex justify-center w-[600px]">
          <ResponsiveContainer width="100%" height={600}>
            <PieChart>
              <Pie
                data={countryDataName}
                dataKey="count"
                nameKey="name"
                outerRadius={150}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {countryDataName.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

/** Helper: type-safe */
function aggregateByKey<T>(data: T[], key: keyof T) {
  const map: Record<string, number> = {};

  for (const item of data) {
    const k = item[key];
    if (typeof k !== "string") continue;
    map[k] = (map[k] || 0) + 1;
  }

  return Object.entries(map).map(([name, count]) => ({ name, count }));
}

function mapCountryCodesToNames(
  arr: { name: string; count: number }[]
) {
  return arr.map((item) => {
    const match = phone.find((p) => p.code === item.name);
    return {
      name: match ? match.name : item.name,
      count: item.count,
    };
  });
}
