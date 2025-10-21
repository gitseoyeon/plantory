import React, { useState } from "react";
import useUserPlantStore from "../../store/userPlantStore";
import { RiDeleteBin6Line } from "react-icons/ri";

const PlantDiaryForm = ({ onClose, onSuccess, plantId }) => {
  const today = new Date().toISOString().split("T")[0];
  const { createPlant } = useUserPlantStore();

  const [form, setForm] = useState({
    physical: "",
    manage: "",
    preferred: "",
    acquiredDate: today,
    memo1: "",
    memo2: "",
  });

  const BLANK_ROW = { file: null, fileName: "", memo: "" };

  // 성장 사진 + 메모 동적 행
  const [growthPhotos, setGrowthPhotos] = useState([{ ...BLANK_ROW }]);
  const [loading, setLoading] = useState(false);

  // 일반 입력 변경
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 사진/메모 행 제어
  const handlePhotoFileChange = (idx, file) => {
    setGrowthPhotos((prev) => {
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        file: file ?? null,
        fileName: file?.name ?? "",
      };
      // 마지막 행에 파일이 들어왔다면 새 행 추가
      const isLast = idx === prev.length - 1;
      if (file && isLast) next.push({ ...BLANK_ROW });
      return next;
    });
  };

  const handlePhotoMemoChange = (idx, memo) => {
    setGrowthPhotos((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], memo };
      return next;
    });
  };

  const removePhotoRow = (idx) => {
    // 첫 행(0)은 삭제 금지 — 줄 정렬 유지를 위해 버튼도 숨김 처리
    if (idx === 0) return;

    setGrowthPhotos((prev) => {
      const next = [...prev];
      next.splice(idx, 1); // 행 제거(숨김 + 값 소멸)
      // 모두 지워지면 최소 1행 유지
      return next.length ? next : [{ ...BLANK_ROW }];
    });
  };

  // 제출
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 파일 업로드 “준비중” — fileName만 보냄
      const photosPayload = growthPhotos
        .filter((p) => p.file || p.fileName || p.memo) // 빈 행 제외
        .map((p) => ({
          imageUrl: p.fileName || null,
          memo: p.memo || "",
        }));

      const payload = {
        ...form,
        growthPhotos: photosPayload, // 백엔드 스키마에 맞춰 조정
      };

      const res = await createPlant(payload);
      onSuccess?.(res);
      onClose?.();
    } catch (err) {
      console.error("[PlantDiaryForm] createPlant error:", err);
      alert("등록 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* 상세 정보 */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            상세 정보{plantId}
          </h2>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            id="physical"
            name="physical"
            value={form.physical}
            onChange={onChange}
            type="text"
            className="w-full rounded-xl border border-gray-300 p-3 text-sm placeholder:text-gray-400 placeholder:font-semibold focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
            placeholder="[필수] 생육 (예: 현재 크기, 성장 단계 등)"
            required
          />
          <input
            id="manage"
            name="manage"
            value={form.manage}
            onChange={onChange}
            type="text"
            className="w-full rounded-xl border border-gray-300 p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
            placeholder="관리 (예: 물 주기, 분갈이, 가지치기 등)"
            required
          />
          <input
            id="preferred"
            name="preferred"
            value={form.preferred}
            onChange={onChange}
            type="text"
            className="w-full rounded-xl border border-gray-300 p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
            placeholder="환경 (예: 적정 온도, 습도, 일조량 등)"
            required
          />
          <input
            id="specialNote"
            name="memo1"
            value={form.memo1}
            onChange={onChange}
            type="text"
            className="w-full rounded-xl border border-gray-300 p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
            placeholder="특이 사항(예: 병충해, 주의점 등)"
          />
        </div>
      </section>

      {/* 성장 기록 */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">성장 기록</h2>
        </div>

        <div className="p-5 space-y-4">
          {/* 날짜 */}
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 items-center">
            <span className="text-sm text-gray-600">기록 날짜</span>
            <input
              id="acquiredDate"
              name="acquiredDate"
              value={form.acquiredDate}
              onChange={onChange}
              type="date"
              className="rounded-xl border border-gray-300 p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              aria-label="기록일자"
            />
          </div>

          {/* 사진/메모 행 */}
          <div className="space-y-3">
            {growthPhotos.map((row, idx) => (
              <div key={idx} className="flex items-center gap-3">
                {/* 파일 선택 */}
                <label
                  className="shrink-0 inline-flex items-center justify-center
                             h-[46px] min-w-[180px] px-4
                             rounded-xl border border-dashed border-gray-300
                             text-sm text-gray-600 hover:border-gray-400 cursor-pointer
                             bg-white"
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handlePhotoFileChange(idx, e.target.files?.[0])
                    }
                  />
                  {row.fileName ? `선택됨: ${row.fileName}` : "성장 사진 선택"}
                </label>

                {/* 메모 */}
                <input
                  type="text"
                  value={row.memo}
                  onChange={(e) => handlePhotoMemoChange(idx, e.target.value)}
                  className="flex-1 h-[46px] rounded-xl border border-gray-300 p-3 text-sm placeholder:text-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                  placeholder="사진 메모"
                />

                {/* 삭제 버튼: 첫 행은 숨김(자기 자리만 유지) / 2행부터 노출 */}
                {idx === 0 ? (
                  <div className="shrink-0 w-8 h-8" aria-hidden="true" />
                ) : (
                  <button
                    type="button"
                    onClick={() => removePhotoRow(idx)}
                    className="shrink-0 inline-flex items-center justify-center
                               w-8 h-8 p-0 m-0 rounded-md text-red-500 hover:text-red-600
                               bg-transparent"
                    title="행 삭제"
                  >
                    <RiDeleteBin6Line size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 버튼 영역 */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-sky-400 text-white px-6 py-2 font-semibold hover:shadow-md hover:scale-[1.01] transition-all disabled:opacity-60"
        >
          {loading ? "저장 중..." : "저장"}
        </button>

        <button
          type="button"
          onClick={() => onClose?.()}
          className="rounded-xl border border-gray-300 bg-white text-gray-700 px-6 py-2 font-semibold hover:bg-gray-50"
        >
          취소
        </button>
      </div>
    </form>
  );
};

export default PlantDiaryForm;
