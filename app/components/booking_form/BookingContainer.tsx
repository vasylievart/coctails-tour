import BookingDateSelectors from "./BookingDateSelectors";



const BookingContainer = () => {

  return (
    <div className="w-full flex flex-col items-center py-10 z-50" >
      <h2 className="text-3xl text-white font-semibold mb-6">Book Your Cocktail Tour</h2>
      {/*Booking Date Selector: 1 Step to set spacified date*/}
      <BookingDateSelectors/>
    </div>
  );
};

export default BookingContainer;
