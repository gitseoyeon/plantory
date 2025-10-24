import React, { useEffect, useState } from "react";
import useUserPlantStore from "../store/userPlantStore";
import PlantCard from "../components/userplant/PlantCard";

const PAGE_SIZE = 6;

const PlantList = ({}) => {
  const { listAllPlants, loading, error, pagination } = useUserPlantStore();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchPlants = async () => {
      const first = await listAllPlants(0, PAGE_SIZE);
      setItems(first || []);
      setPage(0);
    };
    fetchPlants();
  }, [listAllPlants]);

  const handleMore = async () => {
    const nextPage = page + 1;
    const next = await listAllPlants(nextPage, PAGE_SIZE);
    if (Array.isArray(next) && next.length > 0) {
      setItems((prev) => [...prev, ...next]);
      setPage(nextPage);
    }
  };

  const hasMore = (pagination?.totalPages ?? Infinity) > page + 1;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        🌻 <span className="text-green-700">사용자 식물</span>
      </h1>
      <div className="grid grid-cols-2 gap-6 space-y-2">
        {error && !loading && (
          <div className="p-6 text-sm text-red-600 bg-white rounded-xl border border-gray-200">
            에러: {String(error)}
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-500 py-8">불러오는 중...</div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="p-6 text-sm text-gray-500 bg-white rounded-xl border border-gray-200">
            아직 등록된 식물이 없어요.
          </div>
        )}

        {items.map((p) => (
          <PlantCard key={p.id} plant={p} />
        ))}
      </div>

      {!loading && !error && items.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleMore}
            disabled={loading || !hasMore}
            className="w-full sm:w-[calc(50%+0.75rem)] px-4 py-3 text-sm font-semibold 
                 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 
                 disabled:opacity-50"
          >
            {loading ? "불러오는 중..." : hasMore ? "More" : "더 이상 없음"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PlantList;
