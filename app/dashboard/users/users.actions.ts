"use server"

import { createClient } from "@/utils/supabase/client";
import { revalidatePath } from "next/cache";

export async function deleteUser(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('users').delete().eq('id', id); // Or auth.admin.deleteUser if auth users
  if (error) console.error(error);
  revalidatePath('/dashboard/users');
}


export async function getCountryStats() {
  const supabase = createClient();
  const { data: users } = await supabase.from('users').select('country_code');
  return users?.reduce((acc: { [key: string]: number }, u) => {
    acc[u.country_code || 'Unknown'] = (acc[u.country_code|| 'Unknown'] || 0) + 1;
    return acc;
  }, {}) || {};
}