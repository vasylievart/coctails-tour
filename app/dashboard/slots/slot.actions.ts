"use server";

import { createClient } from "@/utils/supabase/client";
import { revalidatePath } from "next/cache";

export async function createSlot(formData: FormData) {
const supabase = createClient();
const date = formData.get('date') as string;
const capacity_total = parseInt(formData.get('capacity_total') as string);
const capacity_left = capacity_total; // Initially full
const enabled = true;

const { error } = await supabase.from('slots').insert({ date, capacity_total, capacity_left, enabled });
if (error) console.error(error);
revalidatePath('/dashboard/slots');
}

export async function toggleSlot(id: number, enabled: boolean) {
  const supabase = createClient();
  const { error } = await supabase.from('slots').update({ enabled: !enabled }).eq('id', id);
  if (error) console.error(error);
  revalidatePath('/dashboard/slots');
}