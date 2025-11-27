type FoodCardProps = {
  foodSrc: string;
  foodName: string;
};

const FoodCard = ({ foodSrc, foodName }: FoodCardProps) => {
  return (
    <div className="w-[108px] h-[74px] bg-[#FAFAFB] flex flex-col justify-center items-center rounded-[8px]">
      <img src={foodSrc} alt={foodName} />
      <div className="text-[14px]">{foodName}</div>
    </div>
  );
};

export default FoodCard;
