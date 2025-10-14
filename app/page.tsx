import Main from "./components/Main";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BookingForm from "./components/BookingForm";

export default function Home() {
  return (
    <div  className="
        w-100% h-100% flex flex-col items-center
        bg-[url('/images/bg-image.webp')] bg-center bg-cover bg-repeat "
    >
      <Header/>
      <Main/>
      <BookingForm/>
      <Footer/>
    </div>
  );
}
