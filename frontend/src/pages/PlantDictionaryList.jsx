import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PlantDictionaryCard from "../components/plant/PlantDictionaryCard";
import { getPlantsByPage } from "../services/plant";

const PlantDictionaryList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [plants, setPlants] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = parseInt(params.get("page")) || 0;
    const queryParam = params.get("query") || "";

    setPage(pageParam);
    setQuery(queryParam);

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getPlantsByPage(pageParam, size, queryParam);

        setPlants(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("식물 데이터 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      navigate(`/dictionary/list?page=0`);
    } else {
      navigate(
        `/dictionary/list?page=0&query=${encodeURIComponent(query.trim())}`
      );
    }
  };

  const handlePageChange = (newPage) => {
    navigate(
      `/dictionary/list?page=${newPage}${
        query ? `&query=${encodeURIComponent(query)}` : ""
      }`
    );
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

      {/* 🌱 식물 카드 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10">
        {plants.length > 0 ? (
          plants.map((p) => <PlantDictionaryCard key={p.id} plant={p} />)
        ) : (
          <div className="col-span-full text-center mt-10 text-gray-600">
            <p className="text-lg mb-2">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 📄 페이지네이션 버튼 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => handlePageChange(idx)}
              className={`px-4 py-2 rounded-lg ${
                idx === page
                  ? "bg-green-700 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlantDictionaryList;
