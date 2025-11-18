"use server";

import { supabaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import type { User } from "@supabase/auth-js";

export async function getAuthUser() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await (await supabase).auth.getUser();

  if (error) {
    console.error("Error fetching auth user:", error.message);
    return null;
  }
  return user;
}

export async function getAdminUsers(): Promise<User[]> {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) throw error;
  return data.users;
}

export async function deleteAdminUser(id: string): Promise<void> {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) throw error;
}

export async function createAdminUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata:{
      role:"admin",
    },
    email_confirm: true,
  });

  if (error) throw error;
  return data.user;
}
