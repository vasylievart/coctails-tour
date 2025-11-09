import Main from "./components/Main";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BookingForm from "./components/BookingForm";
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
