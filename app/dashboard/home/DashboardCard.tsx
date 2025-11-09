"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
import { DashboardData } from "./home.actions";


export default function DashboardCards({ bookingCount,
    availablePlaces,
    totalPlaces,
    amount,
    allSlotData: slots,
    privateTours,
    allBookings: bookings,
    allSlotsAmount}: DashboardData) {
  const [activeModal, setActiveModal] = useState<null | "bookings" | "slots" | "private" | "amount">(null);
  console.log("Client booking count", bookingCount);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bookings Today */}
        <Card
          onClick={() => setActiveModal("bookings")}
          className="cursor-pointer hover:shadow-lg transition"
        >
          <CardHeader>
            <CardTitle>Bookings Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{bookingCount}</p>
          </CardContent>
          <CardFooter>
            <Link className="hover:underline" href="/dashboard/bookings">View All</Link>
          </CardFooter>
        </Card>

        {/* Available Slots */}
        <Card
          onClick={() => setActiveModal("slots")}
          className="cursor-pointer hover:shadow-lg transition"
        >
          <CardHeader>
            <CardTitle>Available Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {availablePlaces} / {totalPlaces}
            </p>
          </CardContent>
        </Card>

        {/* Private Bookings */}
        <Card
          onClick={() => setActiveModal("private")}
          className="cursor-pointer hover:shadow-lg transition"
        >
          <CardHeader>
            <CardTitle>Private Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {privateTours?.length > 0 ? (
                privateTours.map((tour) => (
                  <li key={tour.id} className="border-b pb-1 text-sm">
                    {tour.comment || "No details"}
                  </li>
                ))
              ) : (
                <p>No private bookings.</p>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Total Amount */}
        <Card
          onClick={() => setActiveModal("amount")}
          className="cursor-pointer hover:shadow-lg transition"
        >
          <CardHeader>
            <CardTitle>Total Amount Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">€ {amount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Popups */}
      <Dialog open={activeModal === "bookings"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>All Bookings Today</DialogTitle>
          </DialogHeader>
          <ul className="space-y-2">
            {bookings?.map((b) => (
              <li key={b.id} className="border-b pb-2">
                <p className="font-semibold">{b.full_name}</p>
                <p>{b.comment || "No comment"}</p>
                <p className="text-sm text-gray-500">{b.booking_date}</p>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "slots"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Slots Available Today</DialogTitle>
          </DialogHeader>
          <p>
            Available: {availablePlaces} / {totalPlaces}
          </p>
          <div>All slots:
            <ul className="list-disc pl-5 space-y-1">
              {slots?.length ? (
                slots.map((h, i) => (
                  <li className="border-b pb-2" key={i}>
                    <span className="flex text-sm gap-2">
                      <p className=" text-gray-500">
                        {h.slot_hour}
                      </p>
                      <p>{h.capacity_left}/{h.capacity_total}</p>
                    </span>
                  </li>  
                ))
              ) : (
                <li>No available slots today</li>
              )}
            </ul>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "private"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Private Bookings Today</DialogTitle>
          </DialogHeader>
          <ul className="space-y-2">
            {privateTours?.map((tour) => (
              <li key={tour.id} className="border-b pb-2">
                <p>{tour.comment || "No details"}</p>
                <p className="text-sm text-gray-500">{tour.full_name}</p>
                <p className="text-sm text-gray-500">
                  Booked on: {tour.booking_date}
                </p>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "amount"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Total Revenue</DialogTitle>
          </DialogHeader>
          <p className="text-2xl font-bold">€ {amount}</p>
          <div>All slots:
            <ul className="list-disc pl-5 space-y-1">
              {allSlotsAmount?.length ? (
                allSlotsAmount.map((a, i) => (
                  <li className="border-b pb-2" key={i}>
                    <span className="flex text-sm gap-2">
                      <p className=" text-gray-500">
                        {a.booking_hour}
                      </p>
                      <p>
                        € {a.amount}
                      </p>
                    </span>
                  </li>  
                ))
              ) : (
                <li>No payments today</li>
              )}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
