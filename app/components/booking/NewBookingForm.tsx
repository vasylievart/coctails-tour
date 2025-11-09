"use client";


import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import BookingDateSelectors from "../booking_form/BookingDateSelectors";




//TODO: 
//      Split BookingForm into smaller components
//      Auth
//      Create test
//      Readme
//      Deploy


const NewBookingForm = () => {
  return (
    <div className="w-full flex flex-col items-center py-10 z-50" >
      <h2 className="text-3xl text-white font-semibold mb-6">Book Your Cocktail Tour</h2>
      <BookingDateSelectors/>
    </div>
  );
};

export default NewBookingForm;
