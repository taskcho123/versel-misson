// OrderBar.tsx
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import useCartStore from "../../pages/Store/useCartStore";

const OrderBar = () => {
  const navigate = useNavigate();
  const handleOrder = () => navigate("/cart");

  // 메뉴 전체 배열을 구독하지 말고, 총 금액 값만 구독
  const total = useCartStore((s) => s.totalOrderAmount);

  return (
    <div className="w-full h-[77px] fixed bottom-0 bg-white rounded-tl-2xl rounded-tr-2xl shadow-[0px_-8px_16px_0px_rgba(0,0,0,0.10)] flex justify-between">
      <div className="mt-[16px] ml-[24px]">
        <div className="justify-start text-gray-500 text-base font-normal font-['Pretendard']">
          총 주문금액
        </div>
        <div className="justify-start text-gray-600 text-base font-semibold font-['Pretendard']">
          {total}원
        </div>
      </div>
      <div onClick={handleOrder} className="flex items-center mr-6">
        <Button type="button" size="lg">
          주문하기
        </Button>
      </div>
    </div>
  );
};

export default OrderBar;
