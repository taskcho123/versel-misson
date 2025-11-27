type storeDataProps = {
  id: number;
  name: string;
  rate: number;
  reviewCnt: number;
  minDeliveryTime: number;
  maxDeliveryTime: number;
  deliveryFee: number;
};

const StoreItem = ({
  id,
  name,
  rate,
  reviewCnt,
  minDeliveryTime,
  maxDeliveryTime,
  deliveryFee,
}: storeDataProps) => {
  return (
    <div className="w-[390px] h-[116px] flex">
      <div className="w-[54px] h-[54px] bg-[#ECECEC] rounded-[8px] mt-4 ml-6"></div>
      <div className="mt-4 ml-[17px]">
        <div className="font-['Pretendard'] text-[#333D4B] font-semiBold text-[17px]">
          {id}위
        </div>
        <div className="font-['Pretendard'] text-[#333D4B] font-semiBold text-[17px]">
          {name}
        </div>
        <div className="font-['Pretendard'] text-[#6B7684] font-medium text-[13px]">
          {rate} {"("}{reviewCnt}{")"}
        </div>
        <div className="font-['Pretendard'] text-[#6B7684] font-medium text-[13px]">
          {minDeliveryTime}분~{maxDeliveryTime}분, 배달비 {deliveryFee}원
        </div>
      </div>
    </div>
  );
};

export default StoreItem;
