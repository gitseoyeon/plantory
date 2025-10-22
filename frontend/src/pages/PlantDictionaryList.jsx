import React, { useEffect, useState } from "react";
import { getAllPlants, searchPlants } from "../services/plant";
import PlantDictionaryCard from "../components/plant/PlantDictionaryCard";

const PlantDictionaryList = () => {
  const [plants, setPlants] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false); // ✅ 검색 중 여부

  const fetchAllPlants = async () => {
    try {
      setLoading(true);
      const data = await getAllPlants();
      setPlants(data);
      setIsSearching(false); // ✅ 전체보기로 돌아오면 검색 아님
    } catch (error) {
      console.error("식물 데이터 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPlants();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const results = await searchPlants({ query });
      setPlants(results);
      setIsSearching(true); // ✅ 검색 중 상태로 변경
    } catch (error) {
      console.error("검색 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-600">로딩 중...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        🌿 <span className="text-green-700">식물 백과사전</span>
      </h1>

      {/* 🔍 검색창 */}
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-3 mb-8 bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3"
      >
        <input
          type="text"
          placeholder="식물 이름, 원산지, 과 이름으로 검색하세요 🌱"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-4 py-2 focus:outline-none text-gray-700 rounded-lg"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200"
        >
          검색
        </button>
      </form>

      {/* 🌱 식물 목록 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {plants.length > 0 ? (
          plants.map((plant) => (
            <PlantDictionaryCard key={plant.id} plant={plant} />
          ))
        ) : (
          <div className="col-span-full text-center mt-10 text-gray-600">
            <p className="text-lg mb-2">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 🌿 전체보기 버튼 (검색 중일 때만 표시) */}
      {isSearching && (
        <div className="text-center mt-10">
          <button
            onClick={() => {
              setQuery("");
              fetchAllPlants();
            }}
            className="inline-block bg-green-100 hover:bg-green-200 text-green-700 font-medium px-5 py-2.5 rounded-full transition-all duration-200"
          >
            🌿 전체 목록으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
};

export default PlantDictionaryList;
