import React, { useEffect, useRef, useState } from "react";
import useUserPlantStore from "../store/userPlantStore";
import PlantCard from "../components/userplant/PlantCard";

const PAGE_SIZE = 6;

const PlantList = () => {
  const { listAllPlants, loading, error, pagination } = useUserPlantStore();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    (async () => {
      const first = await listAllPlants(0, PAGE_SIZE);
      setItems(Array.isArray(first) ? first : []);
      setPage(0);
    })();
  }, []);

  const handleMore = async () => {
    const nextPage = page + 1;
    const next = await listAllPlants(nextPage, PAGE_SIZE);

    if (Array.isArray(next) && next.length > 0) {
      // id 기준 중복 방지 병합
      setItems((prev) => {
        const map = new Map(prev.map((p) => [p.id, p]));
        for (const n of next) map.set(n.id, n);
        return Array.from(map.values());
      });
      setPage(nextPage);
    }
  };

  const totalPages = pagination?.totalPages ?? Infinity;
  const hasMore = totalPages > page + 1;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        🌻 <span className="text-green-700">사용자 식물</span>
      </h1>

      {error && !loading && (
        <div className="mb-4 p-6 text-sm text-red-600 bg-white rounded-xl border border-gray-200">
          에러: {String(error)}
        </div>
      )}
      {loading && items.length === 0 && (
        <div className="mb-4 text-center text-gray-500 py-8">
          불러오는 중...
        </div>
      )}
      {!loading && !error && items.length === 0 && (
        <div className="mb-4 p-6 text-sm text-gray-500 bg-white rounded-xl border border-gray-200">
          아직 등록된 식물이 없어요.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
