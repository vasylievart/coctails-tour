/*import { usePersistentState } from "@/app/hooks/usePresistentState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import TotalAmount from "./TotalAmount";
import BookingForm from "./BookingForm";

interface ChangeCapacityProps {
  isoDate: string,
  capacityInit: any,
  capacityLeft?: any,
  placesInit: number,
  selectedHour: string,
  bookingDate?: any;
  mode: "create" | "edit"
}

const ChangeCapacity = ({capacityInit, placesInit, isoDate, selectedHour, bookingDate, capacityLeft, mode} : ChangeCapacityProps) => {
  const supabase = createClient();
  //Set states for capacity, set people_count, and calculate an amount
  const [capacity, setCapacity] = usePersistentState<number>("people-quantity", capacityInit);
  const [bookedPlaces, setBookedPlaces] = usePersistentState<number>("booked-places", 0);
  const [places, setAvalablePlaces] = usePersistentState<number[]>("booking-places", [placesInit]);
  const [price, setPrice] = useState<any>()
  console.log("Places init", placesInit)
  console.log("Capacity init", capacityInit);
  console.log("Mode is?", mode);

  

    useEffect(() => {
      if (!isoDate || !selectedHour) return;
  
      const getCapacity = async () => {
        if(mode==="edit") {
          const { data, error } = await supabase
          .from("slots")
          .select("capacity_left, price")
          .eq("slot_date", bookingDate.booking_date)
          .eq("slot_hour", bookingDate.booking_hour)
          .single();
          if (error) return console.error("Not found capacity", error)
          setCapacity(data?.capacity_left);
        }
        const { data, error } = await supabase
          .from("slots")
          .select("capacity_left, price")
          .eq("slot_date", isoDate)
          .eq("slot_hour", selectedHour)
          .single();
  
        if (!error && data) setCapacity(data.capacity_left);
        setPrice(data?.price && bookedPlaces ? data.price * bookedPlaces : 0);
      };
      getCapacity();
    }, [isoDate, selectedHour, mode, bookingDate.booking_date, bookingDate.booking_hour]);

  //convert capacity number into an array for select
  useEffect(() => {
    if (mode==="edit"){
      if (!capacityInit) return;
      const pl = Array.from({ length: capacityInit }, (_, i) => i + 1);
      setAvalablePlaces(pl);
    }
    if (!capacityInit) return;
      const pl = Array.from({ length: capacityInit }, (_, i) => i + 1);
      setAvalablePlaces(pl);
  }, [capacityInit, mode]);
  

    console.log("People", places);

  return (
    <>
     <div className="flex justify-between gap-4 items-center">
      <span>People:</span>
      <span className="flex-row w-full">{mode==="edit" ?capacityLeft : capacity} places left</span>
      {mode==="edit" ? 
        <span className="flex-row w-full">booked: {placesInit}</span> : ""
      }
      <Select onValueChange={(v) => setBookedPlaces(Number(v))}>
        <SelectTrigger className="border-2 text-xl text-amber-50  rounded-lg focus:ring-2 focus:ring-amber-100">
          <SelectValue placeholder="People"/>
        </SelectTrigger>
        <SelectContent>
          {places.map((p, i) => (
              <SelectItem key={i} value={String(p)}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    /*Pass calculated amount 
    <TotalAmount totalAmount={mode==="edit" ? bookingDate.amount : price}/>
    /*Pass current date, people_count, capacity, and booking_hour 
    <BookingForm isoDate={isoDate} bookedPlaces={bookedPlaces}  capacity_left={capacity} selectedHour={selectedHour}/>
    </>
   
  )
}

export default ChangeCapacity;*/
"use client"
import { usePersistentState } from "@/app/hooks/usePresistentState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import TotalAmount from "./TotalAmount";
import BookingForm from "./BookingForm";


interface ChangeCapacityProps {
  isoDate: string;
  capacityInit: number;
  capacityLeft?: number;
  placesInit?: number;
  selectedHour: string;
  bookingDate?: any;
  mode?: "create" | "edit";
  onClose?: () => void;
}

const ChangeCapacity = ({
  capacityInit,
  placesInit,
  isoDate,
  selectedHour,
  bookingDate,
  capacityLeft,
  mode,
  onClose
}: ChangeCapacityProps) => {
  const supabase = createClient();

  const [capacity, setCapacity] = usePersistentState<number>("people-quantity", capacityInit);
  const [bookedPlaces, setBookedPlaces] = usePersistentState<number>("booked-places", 0);
  const [places, setAvalablePlaces] = usePersistentState<number[]>("booking-places", []);
  const [price, setPrice] = useState<number>(0);
  console.log("Capacity Left", capacityLeft);
  console.log("Capacity", capacity);
  console.log("capacityInit", capacityInit);
  console.log("placesInit", placesInit);
  console.log("places", places);

  useEffect(() => {
    if (!isoDate || !selectedHour) return;
    
    const fetchSlotData = async () => {
      let queryDate;
      let queryHour;
      
      if (mode === "edit") {
        queryDate = bookingDate?.booking_date;
        queryHour = bookingDate?.booking_hour;
      } else {
        queryDate = isoDate;
        queryHour = selectedHour;
      }

      const { data, error } = await supabase
        .from("slots")
        .select("capacity_left, price")
        .eq("slot_date", queryDate)
        .eq("slot_hour", queryHour)
        .single();

      if (error) {
        console.error("Error fetching slot data:", error.message);
        return;
      }

      if (mode === "edit") {
        setCapacity(data?.capacity_left ?? capacityInit);
        setPrice(bookingDate?.amount ?? data?.price ?? 0);
        setBookedPlaces(bookingDate?.people_count ?? 1);
      } else {
        setCapacity(data.capacity_left);
        setPrice(bookedPlaces && data.price ? data.price * bookedPlaces : 0);
        setBookedPlaces(0);
      }
    };

    fetchSlotData();
  }, [isoDate, selectedHour, mode, bookingDate]);

  useEffect(() => {
    if (mode !== "edit") {
      if (!capacityInit) return;
      const placesArray = Array.from({ length: capacityInit }, (_, i) => i + 1);
      setAvalablePlaces(placesArray);
      return;
    }

    const peopleCount = bookingDate?.people_count ?? 0;
    const left = capacityLeft ?? 0;
    let cap: number;

    if (left === 0) {
      cap = peopleCount;
    } else {
      cap = peopleCount + left;
    }

    if (cap < 1) cap = 1;

    const placesArray = Array.from({ length: cap }, (_, i) => i + 1);
    setAvalablePlaces(placesArray);
  }, [mode, capacityInit, capacityLeft, bookingDate?.people_count]);


  return (
    <>
      <div className="flex justify-between gap-4 items-center">
        <span>People:</span>
        <span className="flex-row w-full">
          {mode === "edit" ? capacityLeft : capacity} places left
        </span>
        {mode === "edit" ? <span className="flex-row w-full">booked: {placesInit}</span> : ""}
        <Select onValueChange={(v) => setBookedPlaces(Number(v))}>
          <SelectTrigger className="border-2 text-xl text-amber-50 rounded-lg focus:ring-2 focus:ring-amber-100">
            <SelectValue placeholder="People" />
          </SelectTrigger>
          <SelectContent>
            {places.length < 1 ? <p className="text-sm text-gray-500">No available places</p> : places.map((p, i) => (
              <SelectItem key={i} value={String(p)}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <TotalAmount totalAmount={mode === "edit" ? bookingDate?.amount : price} />

      <BookingForm
        bookingData={bookingDate}
        isoDate={isoDate}
        bookedPlaces={bookedPlaces}
        capacity_left={capacity}
        selectedHour={selectedHour}
        mode={mode}
        onClose={onClose}
      />
    </>
  );
};

export default ChangeCapacity;
