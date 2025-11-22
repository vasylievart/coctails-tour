"use server";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generateBookingPdf(booking: {
  id?: string;
  slot_id?: number;
  booking_date: string;
  booking_hour: string;
  people_count?: number;
  full_name: string;
  email: string;
  country_code: string;
  phone: string;
  comment?: string;
  created_at?: Date;
  amount?: number;
  private_tour: boolean;
  canceled?: boolean;
  active?: boolean;
  updated?: boolean; // if "edit" mode
}) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([600, 800]);

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontSize = 14;
  //const bgColor = rgb(246, 246, 246);

  let y = 750;

  function line(text: string) {
    page.drawText(text, { x: 50, y, size: fontSize, font });
    y -= 25;
  }
  
  line(`Booking Confirmation`);
  line(`------------------------`);
  line(`*If you would like to check or update you booking,`);
  line(`you can use the form below.`);
  line(`For find your booking use email and phone number,`);
  line(`that were used for create the booking`);

  line(`Booking ID: ${booking.id}`);
  if (booking.updated) line(`(Updated Booking)`);

  line(`Name: ${booking.full_name}`);
  line(`Email: ${booking.email}`);
  line(`Phone: ${booking.country_code} ${booking.phone}`);
  line(`People: ${booking.people_count}`);

  line(`Date: ${booking.booking_date}`);
  line(`Time: ${booking.booking_hour}`);

  line(`Private Tour: ${booking.private_tour ? "Yes" : "No"}`);
  line(`------------------------`);
  line(`Coctails Tour Barcelona`);

  if (booking.comment) line(`Comment: ${booking.comment}`);

  const pdfBytes = await pdf.save();

  const base64 = Buffer.from(pdfBytes).toString("base64");

  return base64;
}
