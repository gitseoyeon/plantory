import React, { useEffect, useMemo, useState } from "react";
import useUserPlantStore from "../../store/userPlantStore";
import {
  buildSpeciesIndex,
  getSpeciesIdByName,
  buildCreatePlantPayload,
} from "../../utils/plant";
import { filterByKorean } from "../../utils/korean";
import { PiTrashBold } from "react-icons/pi";

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
    qr: false,
  });

  const uploadPlantPhoto = async (file) => {
    if (!file) {
      throw new Error("업로드할 파일이 없습니다.");
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token || token === "undefined" || token === "null") {
        throw new Error("유효한 토큰이 없습니다. 다시 로그인해주세요.");
      }

      const formData = new FormData();
      formData.append("file", file);

      const uploadUrl = `${import.meta.env.VITE_API_URL}/api/plant/photo`;

      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("[upload] 서버 응답 오류:", res.status, text);
        throw new Error(`업로드 실패 (${res.status})`);
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        console.log("[upload] 서버 응답:", data);
        return data;
      } else {
        const text = await res.text();
        console.error("[upload] JSON 아님:", text);
        throw new Error("서버가 JSON 대신 HTML을 반환했습니다.");
      }
    } catch (err) {
      console.error("[upload] 에러:", err);
      throw err;
    }
  };

  // 파일 선택
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));

    try {
      const res = await uploadPlantPhoto(selectedFile);
      const imageUrl =
        res.imageUrl ||
        res.url ||
        res.path ||
        res.imageUrlPath ||
        res.fileName ||
        "";
      setUploadedUrl(imageUrl);
      setForm((prev) => ({
        ...prev,
        imageUrl,
      }));
    } catch (err) {
      alert("이미지 업로드 실패: " + (err.message || err));
      return;
    }
  };

  // 종 목록
  useEffect(() => {
    (async () => {
      try {
        await Promise.all([listSpecies(), listPotSize()]);
      } catch (e) {
        console.error("[PlantRegister] init load error:", e);
      }
    })();
  }, [listSpecies, listPotSize]);

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setForm((prev) => ({
      ...prev,
      imageFile: null,
      imagePreview: "",
    }));
    document.getElementById("imageUrl").value = ""; // input 초기화
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
    //console.log(payload);

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

        <div className="p-5 space-y-4">
          <div className="flex flex-col gap-4">
            {/* 사진 업로드 영역 */}
            <div className="relative border border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-gray-400">
              {/* 숨겨진 input은 항상 존재하도록 둡니다 (파일 재선택 가능) */}
              <input
                id="imageUrl"
                name="imageUrl"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />

              {!form.imagePreview ? (
                <label
                  htmlFor="imageUrl"
                  className="flex flex-col items-center justify-center text-gray-500 cursor-pointer h-48"
                >
                  <div className="text-sm">식물 초기 사진 선택</div>
                  <div className="text-xs mt-1 text-gray-400">
                    (클릭하여 선택)
                  </div>
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={form.imagePreview}
                    alt="미리보기"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200 bg-gray-50"
                  />

                  {/* 삭제 아이콘 — 클릭 시 파일과 미리보기 초기화 */}
                  <PiTrashBold
                    size={26}
                    title="삭제"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageDelete();
                    }}
                    className="absolute top-2 right-2 cursor-pointer text-red-500 bg-white rounded-full p-1 shadow hover:bg-red-100"
                  />

                  {/* 선택된 파일 이름 (미리보기 아래에 표시, 길면 ... 처리) */}
                  <div className="mt-2 text-sm text-gray-600 truncate">
                    선택됨: {form.imageFile?.name || "이름을 불러올 수 없음"}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="flex items-center gap-6 justify-center">
                <label
                  htmlFor="indoor-true"
                  className="inline-flex items-center gap-2 cursor-pointer"
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
                  className="inline-flex items-center gap-2 cursor-pointer"
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

              <input
                id="location"
                name="location"
                value={form.location}
                onChange={onChange}
                type="text"
                className="w-full rounded-xl border border-gray-300 p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                placeholder="구체적 위치 (거실, 베란다 등)"
              />
            </div>
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

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="text-sm text-gray-500">
              식물별 고유 QR 코드를 생성해 라벨로 인쇄/부착할 수 있어요.
            </div>
            <div
              className="flex items-center gap-2 rounded-xl bg-lime-600 text-white px-5 py-2 text-sm 
       hover:shadow-md hover:scale-[1.01] transition-all"
            >
              <input
                id="qr"
                name="qr"
                type="checkbox"
                checked={form.qr}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, qr: e.target.checked }))
                }
                className="h-4 w-4 accent-lime-500"
              />
              <label htmlFor="qr" className="text-sm text-gray-700">
                QR 코드 생성
              </label>
            </div>
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
