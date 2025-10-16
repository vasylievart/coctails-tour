import { writeFileSync } from "fs";

const start = new Date("2025-10-14");
const hours = [
  "17:30:00", "18:00:00", "18:30:00", 
  "19:00:00", "19:30:00", "20:00:00",
  "20:30:00", "21:00:00", "21:30:00"
];
const weekSlots = [];

for (let i = 0; i < 7; i++) {
  const day = new Date(start);
  day.setDate(start.getDate() + i);

  const dateStr = day.toISOString().split("T")[0];
  for (const hour of hours) {
    weekSlots.push({
      slot_date: dateStr,
      slot_hour: hour,
      capacity_total: 8,
      capacity_left: 8,
      disabled: false
    });
  }
}

writeFileSync("slots.json", JSON.stringify(weekSlots, null, 2));
console.log("✅ Generated slots.json for one week");
