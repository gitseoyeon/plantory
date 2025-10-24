// src/components/feed/AllPlantList.jsx
import React, { useEffect, useState } from "react";
import useUserPlantStore from "../store/userPlantStore";
import PlantCard from "../components/userplant/PlantCard";

const PAGE_SIZE = 3;

const PlantList = ({ newPlant }) => {
  const { listAllPlants, loading, error, pagination } = useUserPlantStore();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);

  // ✅ 처음 데이터 불러오기
  useEffect(() => {
    (async () => {
      const first = await listAllPlants(0, PAGE_SIZE);
      console.log("📦 [AllPlantList] :", first);
      setItems(first || []);
      setPage(0);
    })();
  }, []);

  // ✅ 새로 작성된 일지(newPlant)가 생기면 즉시 반영
  useEffect(() => {
    if (newPlant?.id) {
      setItems((prev) => {
        const alreadyExists = prev.some((p) => p.id === newPlant.id);
        if (alreadyExists) return prev; // 중복 방지
        return [newPlant, ...prev]; // 새 일지 맨 앞에 추가
      });
    }
  }, [newPlant]);

  return (
    <section className="space-y-6">
      {/* 에러 */}
      {error && !loading && (
        <div className="p-6 text-sm text-red-600 bg-white rounded-xl border border-gray-200">
          에러: {String(error)}
        </div>
      )}

      {/* 비었을 때 */}
      {!loading && !error && items.length === 0 && (
        <div className="p-6 text-sm text-gray-500 bg-white rounded-xl border border-gray-200">
          아직 등록된 식물이 없습니다.
        </div>
      )}

      {/* 리스트 (가로 카드 배치) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.slice(0, 3).map((p) => (
          <PlantCard
            key={p.id ?? `${p.name}-${p.petName}-${Math.random()}`}
            plant={p}
          />
        ))}
      </div>
    </section>
  );
};

export default PlantList;
