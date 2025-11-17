import BookingDateSelectors from "./BookingDateSelectors";

const BookingContainer = () => {
  return (
    <section
      className="
        flex flex-col items-center justify-center 
        py-8 sm:py-10 md:py-14
        px-4 sm:px-6 md:px-10
        bg-amber-700/60 backdrop-blur-sm
        rounded-3xl sm:rounded-2xl
        shadow-lg
      "
    >
      <h2
        className="
          text-2xl sm:text-3xl md:text-4xl
          text-white font-semibold
          text-center mb-6 sm:mb-8
          leading-snug tracking-wide
        "
      >
        Book Your Cocktail Tour
      </h2>

      {/* Booking Date Selector (Step 1) */}
      <div
        className="
          w-full max-w-md sm:max-w-lg md:max-w-xl
          flex justify-center z-40
        "
      >
        <BookingDateSelectors />
      </div>
    </section>
  );
};

export default BookingContainer;

