import React, { useEffect, useState } from "react";
import { getAllPlants } from "../services/plant";
import PlantDictionaryCard from "../components/plant/PlantDictionaryCard";

const PlantDictionaryList = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const data = await getAllPlants();
        setPlants(data);
      } catch (error) {
        console.error("식물 데이터 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  if (loading) return <p className="p-6">로딩 중...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🌿 전체 식물 목록</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {plants.length > 0 ? (
          plants.map((plant) => (
            <PlantDictionaryCard key={plant.id} plant={plant} />
          ))
        ) : (
          <p>표시할 식물이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default PlantDictionaryList;
