/*import Main from "./components/Main";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {Toaster} from "react-hot-toast";
import FAQSection from "./components/FAQSection";
import NearestDate from "./components/NearestDate";
import ChangeBooking from "./components/ChangeBooking";
import BookingContainer from "./components/booking_form/BookingContainer";




export default function Home() {
  return (
    <div  className="
        w-100% h-100% flex flex-col items-center
        bg-[url('/images/bg-image.webp')] bg-center bg-cover bg-repeat "
    >
      <Header/>
      <NearestDate/>
      <Toaster 
        position="top-center"
        reverseOrder={false}
        gutter={8}
      />
      <Main/>
      <BookingContainer/>
      <FAQSection/>
      <ChangeBooking/>
      <Footer/>
    </div>
  );
}
*/
import dynamic from "next/dynamic";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NearestDate from "./components/NearestDate";
import BookingContainer from "./components/booking_form/BookingContainer";
import NewMain from "./components/NewMain";


// 💤 Lazy load non-critical components
const FAQSection = dynamic(() => import("./components/FAQSection"), {
  loading: () => <p className="text-white text-center py-8">Loading FAQs...</p>,
});
const ChangeBooking = dynamic(() => import("./components/ChangeBooking"), {
  loading: () => <p className="text-white text-center py-8">Loading booking tools...</p>,
});

export default function Home() {
  return (
    <div className="
          min-h-screen w-full
          bg-[url('/images/bg-image.webp')]
          bg-center bg-cover bg-no-repeat
          text-white
          antialiased
          overflow-x-hidden
          flex flex-col
          items-center
          font-sans
        ">
      {/* Sticky Header */}
      <header className="w-full z-40">
        <Header />
      </header>

      {/* Main Content */}
      <main className="w-full flex flex-col items-center px-4 sm:px-6 md:px-8 space-y-12 sm:space-y-16 mt-24 sm:mt-28*">
        <NearestDate />
      
        <NewMain/>
     
        

        {/* Booking */}
        <section className="w-full max-w-5xl px-2 sm:px-4 z-40">
          <BookingContainer />
        </section>

        {/* FAQ (lazy loaded) */}
        <FAQSection />

        {/* Booking management (lazy loaded) */}
        <ChangeBooking />
      </main>

      {/* Footer */}
      <footer className="flex w-full justify-center mt-12 sm:mt-16">
        <Footer />
      </footer>
    </div>
  );
}
