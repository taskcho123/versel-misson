// src/components/MenuItem/MenuItem.jsx
import Button from "../Button";
import useCartStore from "../../pages/Store/useCartStore";

const MenuItem = ({
  storeId,
  storeName,
  deliveryFee,
  minOrderPrice,
  name,
  price,
  ingredients,
  id,
  onDeleteMenu,
}) => {
  const addMenu = useCartStore((state) => state.addMenu);

  const handleAddMenu = () => {
    addMenu(
      {
        storeId,
        storeName,
        deliveryFee,
        minOrderPrice,
      },
      {
        id,
        name,
        price,
        ingredients,
        quantity: 1,
      }
    );
  };

  return (
    <div className="flex justify-between items-center my-4 px-4">
      <div className="w-[205px]">
        <h3 className="text-[17px] font-semibold">{name}</h3>
        <span className="text-[13px] font-medium">{price}원</span>
        <p className="text-[13px] font-medium">{ingredients}</p>
      </div>

      {/* 버튼 영역 */}
      <div className="flex gap-2">
        {/* 담기 버튼 */}
        <Button type="button" size="sm" onClick={handleAddMenu}>
          담기
        </Button>

        {/* 삭제 버튼 — props로 받은 핸들러 사용 */}
        {onDeleteMenu && (
          <Button
            type="button"
            size="sm"
            style={{ backgroundColor: "#FF6B6B" }}
            onClick={onDeleteMenu}
          >
            삭제
          </Button>
        )}
      </div>
    </div>
  );
};

export default MenuItem;
