import React, { useEffect, useState } from "react";
import { getAllPlants } from "../services/plant";
export default function Sidebar() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        // 전체 데이터 불러오기
        const allPlants = await getAllPlants();

        // 무작위 3개만 선택
        const shuffled = allPlants.sort(() => 0.5 - Math.random());
        const randomThree = shuffled.slice(0, 3);

        setPlants(randomThree);
      } catch (err) {
        console.error("❌ 식물 백과사전 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  if (loading)
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 text-gray-500">
        불러오는 중...
      </div>
    );

  return (
    <div className="space-y-6">
      {/* 🌿 식물 백과사전 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-lg mb-3">📌 식물 정보</h3>
        <ul className="space-y-3">
          {plants.map((p) => (
            <li
              key={p.id}
              className="flex items-center space-x-3 border-b border-gray-100 pb-3 last:border-0"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-green-50">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.koreanName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-green-100"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {p.koreanName || "이름 없음"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {p.scientificName || "학명 없음"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {p.origin ? `원산지: ${p.origin}` : ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
