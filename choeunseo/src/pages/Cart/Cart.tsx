// src/pages/Store/Cart.tsx
import left_chevron from "../../assets/left_chevron.svg";
import SelectMenu from "../../components/SelectMenu/SelectMenu";
import Button from "../../components/Button";
import warning from "../../assets/warning.svg";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../pages/Store/useCartStore";

const Cart = () => {
  const navigate = useNavigate();
  const storeName = useCartStore(s => s.storeName);
  const menus = useCartStore(s => s.menus);
  const deliveryFee = useCartStore(s => s.deliveryFee);
  const minOrderPrice = useCartStore(s => s.minOrderPrice);
  const clearCart = useCartStore(s => s.clearCart);

  // 이전에 useCartStore에 totalOrderAmount를 추가했다면, 여기서 사용합니다.
  // totalOrderAmount는 OrderBar 해결 시에 추가된 것으로 가정합니다.
  // totalOrderAmount가 없다면 아래 orderSum 계산을 사용합니다.
  
  // const orderSum = menus.reduce((acc, m) => acc + (m.price || 0), 0); // 기존 계산
  const orderSum = useCartStore(s => s.totalOrderAmount); // ✨ OrderBar 해결 시 추가된 값 사용 (권장)
  
  const total = orderSum + (deliveryFee || 0);
  const isUnderMin = orderSum < (minOrderPrice || 0);

  return (
    <div>
      <div className="flex justify-between pr-[15px] pt-[9px] pl-[10px] pb-[12px]">
        <img onClick={() => navigate(-1)} src={left_chevron} alt="뒤로가기" />
        <div onClick={() => { clearCart(); navigate("/store"); }} className="text-[16px] font-semibold font-['Pretendard']">
          주문취소
        </div>
      </div>
      <div className="w-full h-[16px] bg-[#F2F4F6]"></div>

      <div>
        <div className="flex justify-between px-6 pt-[26px] pb-3">
          <div className="font-bold text-[17px] font-['Pretendard'] text-[#6B7684]">
            {storeName ?? "가게를 선택하세요"}
          </div>
          <div className="flex items-center justify-center gap-[6px]">
            {isUnderMin && (
              <>
                <div className="font-['Pretendard'] font-medium text-[15px] text-[#F04452]">
                  최소금액 미달
                </div>
                <img src={warning} alt="경고" className="w-[13px] h-[13px]" />
              </>
            )}
          </div>
        </div>

        <div>
          {menus.map((m, idx) => (
            <SelectMenu
            key={m.id ? m.id : `${m.name}-${m.price}-${idx}`}
            name={m.name} 
            price={m.price}
            quantity={m.quantity} // ✨ 수량 전달
          />
          ))}
        </div>

        <div className="flex font-['Pretendard'] text-[#3182F6] items-center justify-center pt-[19px] pb-[20px] border-t-1 border-t-gray-300">
          더 담기 +
        </div>
      </div>

      <div className="w-full h-[16px] bg-[#F2F4F6]"></div>

      <div>
        <div className="flex justify-between px-6 py-2">
          <div className="text-[#8b95A1]">주문금액</div>
          <div>{orderSum}원</div>
        </div>
        <div className="flex justify-between px-6 py-2">
          <div className="text-[#8b95A1]">배달요금</div>
          <div>{deliveryFee}원</div>
        </div>
        <div className="flex justify-between px-6 py-4">
          <div>총 결제금액</div>
          <div className="font-semibold">{total}원</div>
        </div>
      </div>

      <div className="w-full fixed bottom-0 mb-4 flex flex-col justify-center items-center">
        <div className="mb-5 text-4 font-medium text-[#6b7684]">
          최소 주문금액 {minOrderPrice}원
        </div>
        <Button type="button" size="xl" disabled={isUnderMin}>
          {total}원 결제하기
        </Button>
      </div>
    </div>
  );
};

export default Cart;
