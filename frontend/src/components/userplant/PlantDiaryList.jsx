import React from "react";
import noImage from "../../assets/no_image.png";
import useAuthStore from "../../store/authStore";
import { PiPencilSimpleLineBold, PiTrashBold } from "react-icons/pi";
import useUserPlantDiaryStore from "../../store/userDiaryStore";

/**
 * @param {object|array} page - Spring Page 응답(위 JSON) 또는 다이어리 배열
 *   page.content: Array<Diary>
 */
const PlantDiaryList = ({ page, plantOwnerId, plantId, onEdit, onDelete }) => {
  const { user, isAuthenticated } = useAuthStore();
  const deleteDiary = useUserPlantDiaryStore((s) => s.deleteDiary);

  const handleDelete = async (plantId, diaryId) => {
    if (!window.confirm("정말 삭제하시겠어요?")) return;
    try {
      await deleteDiary(plantId, diaryId);
      onDelete?.();
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };

  const items = Array.isArray(page?.content)
    ? page.content
    : Array.isArray(page)
    ? page
    : [];

  const canManage = isAuthenticated && user?.id === plantOwnerId;

  const fmtDate = (d) => {
    if (!d) return "-";
    try {
      const dt = new Date(d);
      if (!isNaN(dt)) return dt.toLocaleDateString();
      return d; // 파싱 실패 시 원문 노출
    } catch {
      return d;
    }
  };

  const growthText = (d) =>
    [d.physical, d.manage, d.preferred, d.careNotes]
      .filter(Boolean)
      .join(" · ") || "—";

  const renderThumbs = (photos = []) => {
    if (!photos.length) {
      return (
        <div className="w-[56px] h-[56px] rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
          <img
            src={noImage}
            alt="no img"
            className="w-full h-full object-cover opacity-70"
          />
        </div>
      );
    }

    const first3 = photos.slice(0, 3);
    const remain = photos.length - first3.length;

    return (
      <div className="flex items-center gap-2">
        {first3.map((p) => (
          <div
            key={p.id ?? p.imageUrl}
            className="w-[56px] h-[56px] rounded-md overflow-hidden border border-gray-200 bg-white"
            title={p.memo || ""}
          >
            <img
              src={
                p.imageUrl
                  ? `${import.meta.env.VITE_API_URL}${
                      p.imageUrl.startsWith("/") ? "" : "/"
                    }${p.imageUrl}`
                  : noImage
              }
              alt={p.memo || "photo"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = noImage;
              }}
            />
          </div>
        ))}
        {remain > 0 && (
          <span className="inline-flex items-center justify-center w-[32px] h-[32px] text-xs font-semibold rounded-full bg-gray-100 text-gray-600 border border-gray-200">
            +{remain}
          </span>
        )}
      </div>
    );
  };

  const memosText = (d) =>
    (d.userPlantPhotos || [])
      .map((p) => p.memo)
      .filter(Boolean)
      .join(" · ") || "—";

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-sky-600 flex items-center gap-2">
        📖 성장일지
      </h2>

      {/* 헤더 (md 이상에서만 표 헤더처럼 보임) */}
      <div className="hidden md:grid grid-cols-[80px_1fr_60px_100px_1fr] gap-5 px-4 py-1 text-xs font-semibold text-gray-500">
        <div>날짜</div>
        <div>성장 (생육·관리·환경·특이)</div>
        <div>사진</div>
        <div>메모</div>
        <div></div>
      </div>

      <ul className="space-y-3">
        {items.length === 0 && (
          <li className="border border-gray-200 rounded-xl p-2 text-sm text-gray-500 bg-white">
            아직 성장일지가 없습니다.
          </li>
        )}

        {items.map((d) => (
          <li
            key={d.id}
            className="border border-gray-200 rounded-md p-2 bg-white hover:shadow-sm transition-shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_60px_100px_1fr] gap-4">
              <div className="text-xs text-gray-700">
                <span className="md:hidden block text-xs text-gray-500">
                  날짜
                </span>
                {fmtDate(d.diaryDate)}
              </div>
              <div className="text-sm text-gray-800 leading-relaxed">
                <span className="md:hidden block text-xs text-gray-500 mb-1">
                  성장 (생육 · 관리 · 환경 · 특이)
                </span>
                {growthText(d)}
              </div>
              <div>
                <span className="md:hidden block text-xs text-gray-500 mb-1">
                  사진
                </span>
                {renderThumbs(d.userPlantPhotos)}
              </div>
              <div className="text-sm text-gray-700">
                <span className="md:hidden block text-xs text-gray-500 mb-1">
                  메모
                </span>
                <p className="line-clamp-2">{memosText(d)}</p>
              </div>
              <div className="flex justify-end">
                {d.id}
                {canManage && (
                  <>
                    <button type="button" onClick={() => onEdit?.(d.id)}>
                      <PiPencilSimpleLineBold
                        size={30}
                        className="px-1 py-1 text-gray-500 rounded-md bg-white hover:bg-gray-200"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(plantId, d.id)}
                    >
                      <PiTrashBold
                        size={30}
                        className="px-1 py-1 rounded-lg  text-red-600 bg-white hover:bg-red-100"
                      />
                    </button>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PlantDiaryList;
