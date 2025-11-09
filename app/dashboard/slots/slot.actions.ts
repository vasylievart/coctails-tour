"use server";

import { createClient } from "@/utils/supabase/client";
import { revalidatePath } from "next/cache";

/*export async function createSlot(formData: FormData) {
const supabase = createClient();
const date = formData.get('date') as string;
const capacity_total = parseInt(formData.get('capacity_total') as string);
const capacity_left = capacity_total; // Initially full
const enabled = true;

const { error } = await supabase.from('slots').insert({ date, capacity_total, capacity_left, enabled });
if (error) console.error(error);
revalidatePath('/dashboard/slots');
}*/

/*export async function toggleSlot(id: number, enabled: boolean) {
  const supabase = createClient();
  const { error } = await supabase.from('slots').update({ enabled: !enabled }).eq('id', id);
  if (error) console.error(error);
  revalidatePath('/dashboard/slots');
}*/

export async function createSlot(formData: FormData) {
  const supabase = createClient();
  const slot_date = formData.get("slot_date") as string;
  const slot_hour = formData.get("slot_hour") as string;
  const capacity_total = Number(formData.get("capacity_total"));
  const price = Number(formData.get("price"));

  const { error } = await supabase.from("slots").insert([
    {
      slot_date,
      slot_hour,
      capacity_total,
      capacity_left: capacity_total,
      price,
      disabled: false,
    },
  ]);

  if (error) throw new Error(error.message);
}

export async function toggleSlot(id: string, disabled: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from("slots")
    .update({ disabled: !disabled })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateSlotPrice(id: string, newPrice: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("slots")
    .update({ price: newPrice })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
