import React, { useEffect, useState } from "react";
import useUserPlantStore from "../../store/userPlantStore";

const PlantDiaryForm = ({ onClose, onSuccess }) => {
  const today = new Date().toISOString().split("T")[0];
  const { createPlant, loading, error, listSpecies, listPotSize, potSizes } =
    useUserPlantStore();

  const [form, setForm] = useState({
    name: "",
    petName: "",
    speciesName: "",
    speciesId: null,
    acquiredDate: today,
    indoor: "true",
    location: "",
    store: "",
    price: "",
    potSize: "",
    imageUrl: "",
  });

  // 변경 핸들러
  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createPlant(payload);
      onSuccess?.(res);
      onClose?.();
    } catch (err) {
      console.error("[PlantRegister] createPlant error:", err);
      alert("등록 실패");
    }
  };
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">상세 정보</h2>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={onChange}
            type="text"
            className="w-full rounded-xl border border-gray-300 p-3 text-sm placeholder:text-gray-400 placeholder:font-semibold focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
            placeholder="[필수] 생육 정보(예:현재 크기, 건강상태, 성장 단계)"
            required
          />
          <input
            id="petName"
            name="petName"
            value={form.petName}
            onChange={onChange}
            type="text"
            className="w-full rounded-xl border border-gray-300 p-3 text-sm placeholder:text-gray-400 placeholder:focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
            placeholder="관리 이력(예:물 주기, 분갈이, 가지치기 등)"
            required
          />
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={onChange}
            type="text"
            className="w-full rounded-xl border border-gray-300 p-3 text-sm placeholder:text-gray-400 placeholder:focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
            placeholder="환경 설정(예:선호 온도, 습도, 일조량, 물 주기 간격 등)"
            required
          />
          <input
            id="petName"
            name="petName"
            value={form.petName}
            onChange={onChange}
            type="text"
            className="w-full rounded-xl border border-gray-300 p-3 text-sm placeholder:text-gray-400 placeholder:focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
            placeholder="특이 사항(예:병충해 이력, 특별 관리 사항, 주의점 등)"
            required
          />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">성장 기록</h2>
        </div>

        <div className="p-5 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              id="acquiredDate"
              name="acquiredDate"
              value={form.acquiredDate}
              onChange={onChange}
              type="date"
              className="flex-1 rounded-xl border border-gray-300 p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              aria-label="구입일 또는 분양받은 날"
            />
            <input
              id="store"
              name="store"
              value={form.store}
              onChange={onChange}
              type="text"
              className="w-full rounded-xl border border-gray-300 p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              placeholder="성장 사진 1 메모"
            />
            <input
              id="price"
              name="price"
              value={form.price}
              onChange={onChange}
              type="number"
              className="w-full rounded-xl border border-gray-300 p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              placeholder="성장 사진 2 메모"
              min="0"
            />
          </div>
          <div>
            <label
              className="block w-full rounded-xl border border-dashed border-gray-300 p- text-center 
                   hover:border-gray-400"
            >
              <input
                id="imageUrl"
                name="imageUrl"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setForm((prev) => ({ ...prev, imageUrl: f.name }));
                }}
              />
              <div className="text-gray-500">
                <div>
                  성장 사진 1(준비중)
                  <span className="ml-5 text-xs mt-1">PNG, JPG (최대 5MB)</span>
                </div>
                {form.imageUrl && (
                  <div className="text-xs mt-2">선택됨: {form.imageUrl}</div>
                )}
              </div>
            </label>
          </div>
          <div>
            <label
              className="block w-full rounded-xl border border-dashed border-gray-300 p- text-center 
                   hover:border-gray-400"
            >
              <input
                id="imageUrl"
                name="imageUrl"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setForm((prev) => ({ ...prev, imageUrl: f.name }));
                }}
              />
              <div className="text-gray-500">
                <div>
                  성장 사진 2(준비중)
                  <span className="ml-5 text-xs mt-1">PNG, JPG (최대 5MB)</span>
                </div>
                {form.imageUrl && (
                  <div className="text-xs mt-2">선택됨: {form.imageUrl}</div>
                )}
              </div>
            </label>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="text-sm text-gray-500">
              식물별 고유 QR 코드를 생성해 라벨로 인쇄/부착할 수 있어요.
            </div>
            <div
              className="flex items-center gap-2 rounded-xl bg-gray-300 text-white px-5 py-2 text-sm 
                   hover:shadow-md hover:scale-[1.01] transition-all"
              title="준비중"
            >
              <input id="qrUrl" name="qrUrl" type="hidden" />
              <input id="qrImageUrl" name="qrImageUrl" type="hidden" />
              <input type="checkbox" disabled />
              QR 코드 생성
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-sky-400 text-white 
                px-6 py-2 font-semibold hover:shadow-md hover:scale-[1.01] transition-all disabled:opacity-60"
        >
          {loading ? "저장 중..." : "저장"}
        </button>

        <button
          type="button"
          onClick={() => onClose?.()}
          className="rounded-xl border border-gray-300 bg-white text-gray-700 
                px-6 py-2 font-semibold hover:bg-gray-50"
        >
          취소
        </button>
      </div>
    </form>
  );
};

export default PlantDiaryForm;
