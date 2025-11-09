interface TotalAmountProps {
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

export default TotalAmount;