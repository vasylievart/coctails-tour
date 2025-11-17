import { signOut } from "@/app/login/actions";
import { getHomeData } from "./home.actions";
import DashboardCards from "./DashboardCard";

export default async function HomePage() {
  const data = await getHomeData();

 
  if (!data) return <p>Error loading dashboard data.</p>;

  const {
    bookingCount,
    availablePlaces,
    totalPlaces,
    amount,
    allSlotData: slots,
    privateTours,
    allBookings: bookings,
    allSlotsAmount,
  } = data;

  console.log(data);


  return (
    <div className="space-y-6 ml-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Home</h1>
        <form >
          <button type="submit" onClick={signOut} className="bg-red-500 ml-4 text-white px-4 py-2 rounded">Sign Out</button>
        </form>
      </div>
      <DashboardCards 
        bookingCount={bookingCount} 
        availablePlaces={availablePlaces} 
        totalPlaces={totalPlaces} 
        amount={amount}  
        allSlotData={slots} 
        privateTours={privateTours} 
        allBookings={bookings} 
        allSlotsAmount={allSlotsAmount} />
    </div>
  );
}