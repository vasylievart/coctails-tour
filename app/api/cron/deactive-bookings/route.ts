import { deactivateOldBookings } from "@/utils/deactivateOldBookings";
import { NextResponse } from "next/server";


export async function GET() {
  const result = await deactivateOldBookings();

  return NextResponse.json({
    success: result.success,
    timestamp: new Date().toISOString(),
  });
}
