import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    console.log(data)
    if (error) {
      console.error("Error exchanging code:", error);
      return NextResponse.redirect(new URL("/login?error=auth", request.url));
    }
    // Success — redirect to dashboard or home
    return NextResponse.redirect(new URL("/private", request.url));
  }

  return NextResponse.redirect(new URL("/login", request.url));
}
