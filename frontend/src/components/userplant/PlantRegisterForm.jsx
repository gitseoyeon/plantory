import React, { useEffect, useMemo, useState } from "react";
import useUserPlantStore from "../../store/userPlantStore";
import {
  buildSpeciesIndex,
  getSpeciesIdByName,
  buildCreatePlantPayload,
} from "../../utils/plant";
import { filterByKorean } from "../../utils/korean";

const PlantRegisterForm = ({ onClose, onSuccess }) => {
  const today = new Date().toISOString().split("T")[0];
  const {
    createPlant,
    loading,
    error,
    listSpecies,
    species,
    listPotSize,
    potSizes,
  } = useUserPlantStore();

  const [openSuggest, setOpenSuggest] = useState(false); // 자동완성 드롭다운 상태
  const [filtered, setFiltered] = useState([]); // [{id, name}, ...]
  const [highlight, setHighlight] = useState(-1); // 키보드 포커스 index

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

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([listSpecies(), listPotSize()]);
      } catch (e) {
        console.error("[PlantRegister] init load error:", e);
      }
    })();
  }, [listSpecies, listPotSize]);

  // 종 목록 로드
  useEffect(() => {
    (async () => {
      try {
        await listSpecies();
      } catch (e) {
        console.error("[PlantRegister] listSpecies error:", e);
      }
    })();
  }, [listSpecies]);

  // 이름→ID 인덱스
  const speciesIndex = useMemo(
    () => buildSpeciesIndex(species || []),
    [species]
  );

  // 변경 핸들러
  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "speciesName") {
      // 사용자가 타이핑 → 이름 업데이트, id 초기화, 후보 계산
      const nextForm = { ...form, speciesName: value, speciesId: null };
      setForm(nextForm);

      const base = Array.isArray(species) ? species : [];
      const next = filterByKorean(base, value).slice(0, 8);
      setFiltered(next);
      setOpenSuggest(!!value && next.length > 0);
      setHighlight(-1);
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 드롭다운 항목 선택
  const pickSpecies = (item) => {
    setForm((prev) => ({
      ...prev,
      speciesName: item.name,
      speciesId: item.id,
    }));
    setOpenSuggest(false);
    setHighlight(-1);
  };

  // blur 시 이름→ID 보정
  const onSpeciesBlur = () => {
    if (!form.speciesName) {
      setForm((p) => ({ ...p, speciesId: null }));
      return;
    }
    const id = getSpeciesIdByName(form.speciesName, speciesIndex);
    setForm((p) => ({ ...p, speciesId: id }));
  };

  // 키보드 탐색
  const onSpeciesKeyDown = (e) => {
    if (!openSuggest || filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[highlight] ?? filtered[0];
      if (item) pickSpecies(item);
    } else if (e.key === "Escape") {
      setOpenSuggest(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    let speciesId = form.speciesId;
    if (!speciesId && form.speciesName) {
      speciesId = getSpeciesIdByName(form.speciesName, speciesIndex);
      if (!speciesId) {
        alert("종은 목록에서 선택해주세요.");
        return;
      }
    }

    const payload = buildCreatePlantPayload({ ...form, speciesId });

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
          <h2 className="text-lg font-semibold text-gray-800">기본 정보</h2>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={onChange}
            type="text"
            className="w-full rounded-xl border border-gray-300 p-3 text-sm placeholder:text-gray-400 placeholder:font-semibold focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
            placeholder="[필수] 식물명"
            required
          />
          <input
            id="petName"
            name="petName"
            value={form.petName}
            onChange={onChange}
            type="text"
            className="w-full rounded-xl border border-gray-300 p-3 text-sm placeholder:text-gray-400 placeholder:font-semibold focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
            placeholder="[필수] 별명"
            required
          />

          {/* 종 자동완성 */}
          <div className="relative">
            <input
              id="speciesName"
              name="speciesName"
              value={form.speciesName}
              onChange={onChange}
              onBlur={onSpeciesBlur}
              onKeyDown={onSpeciesKeyDown}
              type="text"
              autoComplete="off"
              className="w-full rounded-xl border border-gray-300 p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              placeholder=" 종류 (예: 다육 / ㄷㅇ 초성 검색)"
              onFocus={() => {
                if (form.speciesName) {
                  const base = Array.isArray(species) ? species : [];
                  const next = filterByKorean(base, form.speciesName).slice(
                    0,
                    8
                  );
                  setFiltered(next);
                  setOpenSuggest(next.length > 0);
                }
              }}
            />

            {openSuggest && filtered.length > 0 && (
              <ul className="absolute z-50 mt-1 w-full max-h-64 overflow-auto bg-white border border-gray-200 rounded-xl shadow-lg">
                {filtered.map((item, idx) => (
                  <li
                    key={item.id}
                    onMouseDown={() => pickSpecies(item)}
                    className={
                      "px-3 py-2 text-sm cursor-pointer " +
                      (idx === highlight ? "bg-green-50" : "hover:bg-gray-50")
                    }
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 shrink-0">
              구입일/분양일
            </span>
            <input
              id="acquiredDate"
              name="acquiredDate"
              value={form.acquiredDate}
              onChange={onChange}
              type="date"
              className="flex-1 rounded-xl border border-gray-300 p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              aria-label="구입일 또는 분양받은 날"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">그 외 정보</h2>
        </div>

        <div className="p-5 space-y-6">
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
                <div>식물 초기 사진(준비중)</div>
                <div className="text-xs mt-1">PNG, JPG (최대 5MB)</div>
                {form.imageUrl && (
                  <div className="text-xs mt-2">선택됨: {form.imageUrl}</div>
                )}
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-6">
                <label
                  htmlFor="indoor-true"
                  className="inline-flex items-center gap-2"
                >
                  <input
                    id="indoor-true"
                    type="radio"
                    name="indoor"
                    value="true"
                    className="h-4 w-4"
                    checked={form.indoor === "true"}
                    onChange={onChange}
                  />
                  <span>실내</span>
                </label>
                <label
                  htmlFor="indoor-false"
                  className="inline-flex items-center gap-2"
                >
                  <input
                    id="indoor-false"
                    type="radio"
                    name="indoor"
                    value="false"
                    className="h-4 w-4"
                    checked={form.indoor === "false"}
                    onChange={onChange}
                  />
                  <span>실외</span>
                </label>
              </div>
            </div>

            <input
              id="location"
              name="location"
              value={form.location}
              onChange={onChange}
              type="text"
              className="w-full rounded-xl border border-gray-300 p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              placeholder=" 구체적 위치 (거실, 베란다 등)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              id="store"
              name="store"
              value={form.store}
              onChange={onChange}
              type="text"
              className="w-full rounded-xl border border-gray-300 p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              placeholder=" 구입처"
            />
            <input
              id="price"
              name="price"
              value={form.price}
              onChange={onChange}
              type="number"
              className="w-full rounded-xl border border-gray-300 p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              placeholder=" 가격 (숫자만)"
              min="0"
            />
            <select
              id="potSize"
              name="potSize"
              value={form.potSize}
              onChange={onChange}
              className={[
                "w-full rounded-xl border border-gray-300 p-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 bg-white",
                form.potSize ? "text-gray-700" : "text-gray-400",
              ].join(" ")}
            >
              {/* 초기에는 선택만 되고, 실제 값으론 제출되지 않도록 disabled */}
              <option value="" disabled>
                화분 크기 선택
              </option>
              {potSizes.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="text-gray-700 font-normal"
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-lime-500 text-white 
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

export default PlantRegisterForm;
