"use client" 
import { usePersistentState } from "@/app/hooks/usePresistentState"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { createClient } from "@/utils/supabase/client"; 
import { useEffect, useState } from "react"; 
import TotalAmount from "./TotalAmount"; 
import BookingForm from "./BookingForm"; 
import { Booking } from "@/app/utils/types";

interface ChangeCapacityProps { 
  isoDate: string |undefined; 
  capacityInit?: number; 
  capacityLeft?: number | undefined; 
  placesInit?: number; 
  selectedHour: string | undefined; 
  bookingDate?: Booking; 
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
  const [capacity, setCapacity] = usePersistentState<number | undefined>("people-quantity", capacityInit); 
  const [bookedPlaces, setBookedPlaces] = usePersistentState<number>("booked-places", 0); 
  const [places, setAvalablePlaces] = usePersistentState<number[]>("booking-places", []); 
  const [price, setPrice] = useState<number>(0); 
  console.log("Available places:", places);
  useEffect(() => { 
    if (!isoDate || !selectedHour) return; 
    const fetchSlotData = async () => { 
      let queryDate; let queryHour; 

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
          console.error("Error fetching slot data:", error.message); return; 
        } 

        if (mode === "edit") { 
          setCapacity(data?.capacity_left ?? capacityInit); 
          setPrice(bookingDate?.amount ?? data?.price ?? 0); 
          setBookedPlaces(bookingDate?.people_count ?? 1); 
        } else { 
          setCapacity(data.capacity_left); 
          setPrice(bookedPlaces && data.price ? data.price * bookedPlaces : 0); 

        } 
      }; 

      fetchSlotData(); 
    }, [isoDate, selectedHour, mode, bookingDate, bookedPlaces, setBookedPlaces, capacityInit, setCapacity, supabase]);

    useEffect(() => { 
      if (mode !== "edit") { 
        if (!capacityInit) return; 

        const placesArray = Array.from({ length: capacityInit }, (_, i) => i + 1); 
        setAvalablePlaces(placesArray); return; 
      } 
      const peopleCount = bookingDate?.people_count ?? 0; 
      const left = capacityLeft ?? 0; let cap: number; 
      if (left === 0) { 
        cap = peopleCount; 
      } else { 
        cap = peopleCount + left; 
      } if (cap < 1) cap = 1;

      const placesArray = Array.from({ length: cap }, (_, i) => i + 1); 
      console.log(placesArray)
      setAvalablePlaces(placesArray); 
    }, [mode, capacityInit, capacityLeft, bookingDate?.people_count, setAvalablePlaces]); 
  

    return ( 
      <div className="flex flex-col w-full text-base sm:text-lg"> 
        <div className="flex flex-wrap justify-between items-center gap-2 sm:gap-4 w-full text-white/90"> 
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">People:</span> 
            <span className="text-amber-200 text-sm sm:text-base"> 
              {mode === "edit" ? capacityLeft : capacity} places left 
            </span> 
              {mode === "edit" ? 
            <span className="text-white/70 text-sm sm:text-base">booked: {placesInit}</span> 
              : ""}
          </div>
            <Select onValueChange={(v) => setBookedPlaces(Number(v))}> 
              <SelectTrigger className="sm:w-36 border-2 border-white/40 bg-amber-900/60 text-white text-lg rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-200 hover:border-amber-100 transition"> 
                <SelectValue placeholder="Select" /> 
              </SelectTrigger> 
              <SelectContent className="bg-amber-900/95 border border-white/20 rounded-xl text-white max-h-60 overflow-y-auto text-base sm:text-lg"> 
                {places.length < 1 ? 
                  <div className="px-3 py-2 text-sm text-white/70">No available places</div> 
                : places.map((p, i) => ( 
                  <SelectItem key={i} value={String(p)} className="hover:bg-amber-700/70"> 
                    {p} 
                  </SelectItem> 
                ))} 
              </SelectContent> 
            </Select> 
        </div> 
        <div>
          <TotalAmount totalAmount={mode === "edit" ? bookingDate?.amount : price} />
        </div>
        <div className="mt-2 sm:mt-4">
          <BookingForm 
            bookingData={bookingDate} 
            isoDate={isoDate} 
            bookedPlaces={bookedPlaces} 
            capacity_left={capacity} 
            selectedHour={selectedHour} 
            mode={mode} onClose={onClose} 
          />
        </div>
         
      </div> 
    ); 
  }; 
  
export default ChangeCapacity;
