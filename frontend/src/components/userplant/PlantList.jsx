import React, { useEffect, useState } from "react";
import useUserPlantStore from "../../store/userPlantStore";
import PlantCard from "./PlantCard";

const PAGE_SIZE = 5;

const PlantList = () => {
  const { listAllPlants, loading, error, pagination } = useUserPlantStore();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    (async () => {
      const first = await listAllPlants(0, PAGE_SIZE);
      console.log("📦 [PlantList] :", first);
      setItems(first || []);
      setPage(0);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMore = async () => {
    const nextPage = page + 1;
    const next = await listAllPlants(nextPage, PAGE_SIZE);
    if (Array.isArray(next) && next.length > 0) {
      setItems((prev) => [...prev, ...next]);
      setPage(nextPage);
    }
  };

  const hasMore = pagination?.totalPages
    ? page + 1 < pagination.totalPages
    : true;

  return (
    <section className="space-y-4">
      {/* 에러 */}
      {error && !loading && (
        <div className="p-6 text-sm text-red-600 bg-white rounded-xl border border-gray-200">
          에러: {String(error)}
        </div>
      )}

      {/* 비었을 때 */}
      {!loading && !error && items.length === 0 && (
        <div className="p-6 text-sm text-gray-500 bg-white rounded-xl border border-gray-200">
          아직 등록된 식물이 없어요.
        </div>
      )}

      {/* 리스트 */}
      {items.map((p) => (
        <PlantCard
          key={p.id ?? `${p.name}-${p.petName}-${Math.random()}`}
          plant={p}
        />
      ))}

      {/* More 버튼 */}
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={handleMore}
          disabled={loading || !hasMore}
          className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "불러오는 중..." : hasMore ? "More" : "더 이상 없음"}
        </button>
      </div>
    </section>
  );
};

export default PlantList;
