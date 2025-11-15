/*interface TotalAmountProps {
  totalAmount: number;
}
const TotalAmount = ({totalAmount} : TotalAmountProps) => {
  return (
    <div className="flex justify-between items-center">
      <span>Price:</span>
      <span>{totalAmount} €</span>
    </div>
  )
}

export default TotalAmount;*/
interface TotalAmountProps {
  totalAmount: number;
}

const TotalAmount = ({ totalAmount }: TotalAmountProps) => {
  console.log("Total Amount", totalAmount);
  return (
    <div
      className="
        flex justify-between items-center 
        w-full max-w-md 
        bg-white/10 backdrop-blur-sm 
        rounded-xl px-4 py-2 mt-4
        text-white text-base sm:text-lg font-medium
        shadow-sm border border-white/20
      "
    >
      <span className="text-gray-200">Total:</span>
      <span className="text-amber-300 font-semibold tracking-wide">
        {totalAmount} €
      </span>
    </div>
  );
};

export default TotalAmount;
