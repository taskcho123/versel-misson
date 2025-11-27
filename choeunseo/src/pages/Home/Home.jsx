// src/pages/Home/Home.tsx
import { useEffect, useState } from "react";
import FoodCard from "../../components/FoodCard/FoodCard";
import OrderBar from "../../components/OrderBar/OrderBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { imageMap } from "../../models/imageMap";

const API_BASE = "http://localhost:3001";

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // GET: foodCategories 불러오기
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${API_BASE}/foodCategories`)
      .then((res) => {
        if (!res.ok) throw new Error("네트워크 에러");
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setCategories(data);
      })
      .catch((err) => {
        console.error("카테고리 로딩 실패:", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // (선택) POST 예시: 새 카테고리 추가
  async function addCategory(newCategory) {
    try {
      const res = await fetch(`${API_BASE}/foodCategories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      if (!res.ok) throw new Error("생성 실패");
      const data = await res.json();
      setCategories((prev) => [...prev, data]);
    } catch (err) {
      console.error(err);
      alert("카테고리 추가 실패");
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <div>카테고리 로딩중...</div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-[25px] pl-[24px] pb-1 mt-[41px] mb-[74px]">
        <div className="color-[#191F28] text-[26px] font-bold">
          오늘은 무엇을 먹을까요?
        </div>
        <div className="color-[#333D4B] text-[17px] font-medium">
          한남중앙로 40길 (한남 빌리지)(으)로 배달 &gt;
        </div>
      </div>

      <div
        onClick={() => navigate("/store")}
        className="grid grid-cols-3 gap-[9px] px-6"
      >
        {categories.map((item) => (
          <FoodCard
            key={item.id}
            foodSrc={imageMap[item.image] || imageMap.others}
            foodName={item.name}
          />
        ))}
      </div>

      <OrderBar />
    </>
  );
}