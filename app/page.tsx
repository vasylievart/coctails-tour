import Main from "./components/Main";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BookingForm from "./components/BookingForm";
import {Toaster} from "react-hot-toast";

export default function Home() {
  return (
    <div  className="
        w-100% h-100% flex flex-col items-center
        bg-[url('/images/bg-image.webp')] bg-center bg-cover bg-repeat "
    >
      <Header/>
      <Toaster 
        position="top-center"
        reverseOrder={false}
        gutter={8}
      />
      <Main/>
      <BookingForm/>
      <Footer/>
    </div>
  );
}
