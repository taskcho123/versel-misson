// src/pages/Store/Store.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import left_chevron from "../../assets/left_chevron.svg";
import OrderBar from "../../components/OrderBar/OrderBar";
import StoreItem from "../../components/StoreItem/StoreItem";

const API_BASE = "http://localhost:3001";

const Store = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${API_BASE}/stores`)
      .then((res) => {
        if (!res.ok) throw new Error("네트워크 오류");
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setStores(data);
      })
      .catch((err) => console.error("가게 목록 호출 실패", err))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <div>
      <div className="mt-[10px] ml-[17px]">
        <img onClick={() => navigate("/")} src={left_chevron} alt="뒤로가기" />
      </div>

      <div className="mt-[26px] ml-[24px] color-[#191F28] text-[26px] font-bold">
        샐러드
      </div>

      {loading ? (
        <div className="p-6">로딩중...</div>
      ) : (
        stores.map((item) => (
          <div key={item.id} onClick={() => navigate(`/store/${item.id}`)}>
            <StoreItem
              id={item.id}
              name={item.name}
              rate={item.rate}
              reviewCnt={item.reviewCnt}
              minDeliveryTime={item.minDeliveryTime}
              maxDeliveryTime={item.maxDeliveryTime}
              deliveryFee={item.deliveryFee}
            />
          </div>
        ))
      )}

      <OrderBar />
    </div>
  );
};

export default Store;
