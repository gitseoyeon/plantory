import React, { useEffect, useRef, useState } from "react";
import useUserDiaryStore from "../store/userDiaryStore";
import Masonry from "../components/userplant/Masonry"; // 있으면 사용

const PAGE_SIZE = 10;

const PlantDiaryList = () => {
  const { listAllDiaryPhotos, loading, error, pagination } =
    useUserDiaryStore();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const didInit = useRef(false);

  const randomHeights = [250, 600, 650, 800, 450, 500, 550, 600, 450, 600];

  // 데이터 로드 + 변환
  const mapToMasonryItems = (list) =>
    (list ?? []).map((item, idx) => ({
      id: item.id,
      plantId: item.plantId,
      img: `${import.meta.env.VITE_API_URL}${item.imageUrl}`, // imageUrl → img
      url: `/plant/${item.plantId}`,
      height: randomHeights[idx % randomHeights.length],
    }));

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    (async () => {
      try {
        const first = await listAllDiaryPhotos(0, PAGE_SIZE);
        const mapped = mapToMasonryItems(first.content);
        setItems(mapped);
        //setItems(first.content ?? []);
        setPage(0);
      } catch (e) {
        console.error("초기 다이어리 로드 실패:", e);
      }
    })();
  }, [listAllDiaryPhotos]);

  console.log("[Masonry]", items);

  // 더 불러오기
  const handleMore = async () => {
    const nextPage = page + 1;
    try {
      const next = await listAllDiaryPhotos(nextPage, PAGE_SIZE);
      const mapped = mapToMasonryItems(next.content);

      //const nextItems = next.content ?? [];
      //if (nextItems.length > 0) {
      if (mapped.length > 0) {
        setItems((prev) => {
          const map = new Map(prev.map((p) => [p.id, p]));
          //for (const n of nextItems) map.set(n.id, n);
          for (const n of mapped) map.set(n.id, n);
          return Array.from(map.values());
        });
        setPage(nextPage);
      }
    } catch (e) {
      console.error("다음 페이지 로드 실패:", e);
    }
  };

  const totalPages = pagination?.totalPages ?? Infinity;
  const hasMore = totalPages > page + 1;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        🌻 <span className="text-green-700">성장일지</span>
      </h1>

      {error && (
        <div className="mb-4 p-4 text-sm text-red-600 bg-white rounded-xl border border-gray-200">
          에러: {String(error)}
        </div>
      )}

      {loading && items.length === 0 && (
        <div className="mb-4 text-center text-gray-500 py-8">
          불러오는 중...
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="mb-4 p-6 text-sm text-gray-500 bg-white rounded-xl border border-gray-200">
          아직 등록된 일지가 없습니다.
        </div>
      )}

      {/* Masonry 컴포넌트가 있으면 그걸 쓰고, 없으면 간단히 map 렌더
      {items.length > 0 && ( */}

      <div>
        {Masonry ? (
          <Masonry items={items} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((it) => (
              <div key={it.id} className="bg-white p-4 rounded-xl border">
                <div className="text-sm text-gray-700">
                  {it.title || it.memo || "내용"}
                </div>
                {it.imageUrl && (
                  <img
                    src={it.imageUrl}
                    alt={it.title || "diary"}
                    className="mt-2 w-full h-40 object-cover rounded-md"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* )} */}

      {/* 더보기 버튼 
      {!loading && !error && items.length > 0 && hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleMore}
            className="w-full sm:w-[calc(50%+0.75rem)] px-4 py-3 text-sm font-semibold rounded-xl border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            더 보기
          </button>
        </div>
      )}*/}
    </div>
  );
};

export default PlantDiaryList;
