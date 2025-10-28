"use client"

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts"; 
import { getDailyStats } from "./stats.actions";


// Helper to aggregate bookings by date range (simplified)


export default function StatsPage() {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    async function getData(){
      const data = await getDailyStats();
      if (!data) return console.error("Failed find data");
      console.log("Stats data", data)
      setChartData(data);
    }
    getData();
  },[]);




  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Statistics</h1>
      <div className="h-[400px] min-w-0 min-h-[400px]">
        <ResponsiveContainer  width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" name="Daily Amount" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Add more charts for weeks/months/slots similarly */}
      <p>(Extend with weekly/monthly aggregations and slot-specific stats as needed.)</p>
    </div>
  );
}