// src/pages/Store/Stores.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import left_chevron from "../../assets/left_chevron.svg";
import OrderBar from "../../components/OrderBar/OrderBar";
import MenuItem from "../../components/MenuItem/MenuItem";

const API_BASE = "http://localhost:3001";

const Stores = () => {
  const params = useParams();
  const navigate = useNavigate();
  const storeId = Number(params.id);

  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  // GET: 특정 가게
  useEffect(() => {
    if (!Number.isFinite(storeId)) return;
    let mounted = true;
    setLoading(true);
    fetch(`${API_BASE}/stores/${storeId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setStore(data);
      })
      .catch((err) => {
        console.error("가게 상세 실패", err);
        setStore(null);
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [storeId]);

  // 메뉴 추가 예시: menus 배열을 PATCH로 갱신
  const addMenuToStore = async (menu) => {
    if (!store) return;
    try {
      const nextMenus = [...(store.menus || [])];
      const nextId = nextMenus.length === 0 ? 1 : Math.max(...nextMenus.map((m) => m.id || 0)) + 1;
      const newMenu = { id: nextId, ...menu };
      nextMenus.push(newMenu);

      const res = await fetch(`${API_BASE}/stores/${store.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menus: nextMenus }),
      });
      if (!res.ok) throw new Error("메뉴 추가 실패");
      const updated = await res.json();
      setStore(updated);
    } catch (err) {
      console.error(err);
      alert("메뉴 추가 실패");
    }
  };

  // 메뉴 삭제 예시
  const removeMenuFromStore = async (menuId) => {
    if (!store) return;
    try {
      const nextMenus = (store.menus || []).filter((m) => m.id !== menuId);
      const res = await fetch(`${API_BASE}/stores/${store.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menus: nextMenus }),
      });
      if (!res.ok) throw new Error("메뉴 삭제 실패");
      const updated = await res.json();
      setStore(updated);
    } catch (err) {
      console.error(err);
      alert("메뉴 삭제 실패");
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mt-[10px] ml-[17px]">
          <img onClick={() => navigate("/store")} src={left_chevron} alt="뒤로가기" />
        </div>
        <div className="p-6">로딩중...</div>
      </div>
    );
  }

  if (!store) {
    return (
      <div>
        <div className="mt-[10px] ml-[17px]">
          <img onClick={() => navigate("/store")} src={left_chevron} alt="뒤로가기" />
        </div>
        <div className="p-6">가게를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-[10px] ml-[17px]">
        <img onClick={() => navigate("/store")} src={left_chevron} alt="뒤로가기" />
      </div>

      <div className="mb-36">
        <div>
          <div className="font-['Pretendard'] mt-[26px] ml-[24px] color-[#191F28] text-[26px] font-bold">
            {store.name}
          </div>
        </div>

        <div>
          <div className="pt-[26px] pl-6 pb-[11px] text-[17px] font-semibold text-[#6B7684]">
            샐러드
          </div>

          {(store.menus || []).map((menu) => (
            <div key={menu.id ?? `${menu.name}-${menu.price}`}>
              <MenuItem
                id={menu.id}
                name={menu.name}
                price={menu.price}
                ingredients={menu.ingredients}
                // 가게 정보 전달
                storeId={store.id}
                storeName={store.name}
                deliveryFee={store.deliveryFee}
                minOrderPrice={store.minDeliveryPrice}
                onDeleteMenu={() => removeMenuFromStore(menu.id)}
              />
            </div>
          ))}

          {/* 간단한 메뉴 추가 UI (샘플) */}
          <AddMenuInline onAdd={(m) => addMenuToStore(m)} />
        </div>
      </div>

      <OrderBar />
    </div>
  );
};

function AddMenuInline({ onAdd }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(8000);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return alert("이름 입력");
        onAdd({ name: name.trim(), price, isBest: false, ingredients: "" });
        setName("");
        setPrice(8000);
      }}
      style={{ padding: 12 }}
    >
      <input placeholder="메뉴명" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} style={{ marginLeft: 8 }} />
      <button type="submit" style={{ marginLeft: 8 }}>메뉴 추가</button>
    </form>
  );
}

export default Stores;
