import React, { useState, useRef } from "react";
import useUserPlantDiaryStore from "../../store/userDiaryStore";
import { PiTrashBold } from "react-icons/pi";

const PlantDiaryForm = ({ onClose, plantId }) => {
  const today = new Date().toISOString().split("T")[0];
  const createDiary = useUserPlantDiaryStore((s) => s.createDiary);

  const [form, setForm] = useState({
    physical: "",
    manage: "",
    preferred: "",
    careNotes: "",
    diaryDate: today,
  });

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const uploadPlantPhoto = async (plantId, file) => {
    if (!plantId) {
      throw new Error("plantId가 없어 업로드할 수 없습니다.");
    }
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

      const uploadUrl = `${
        import.meta.env.VITE_API_URL
      }/api/diary/photos/${plantId}`;

      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        //console.error("[upload] 서버 응답 오류:", res.status, text);
        throw new Error(`업로드 실패 (${res.status})`);
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        //console.log("[upload] 서버 응답:", data);
        return data;
      } else {
        const text = await res.text();
        //console.error("[upload] JSON 아님:", text);
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

    if (!plantId) {
      alert("반려 식물을 먼저 선택해주세요.");
      e.target.value = ""; // 같은 파일 재선택 가능하게 초기화
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));

    try {
      const res = await uploadPlantPhoto(plantId, selectedFile);
      setUploadedUrl(res.imageUrl || res.imageUrlPath || res.fileName || "");
      console.log("업로드 완료 - imageUrl:", res);
      setForm((prev) => ({
        ...prev,
        userPlantPhotos: [{ imageUrl: res.imageUrl, memo }],
      }));
    } catch (err) {
      alert("이미지 업로드 실패: " + (err.message || err));
      return;
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!plantId) {
      alert("반려 식물을 선택하세요.");
      return;
    }
    setLoading(true);
    try {
      const photosPayload = uploadedUrl
        ? [{ imageUrl: uploadedUrl, memo }]
        : [];
      const payload = { ...form, plantId, userPlantPhotos: photosPayload };
      console.log("[payload]", payload);
      const res = await createDiary(payload);
      onClose?.();
    } catch (err) {
      console.error("[PlantDiaryForm] createDiary error:", err);
      alert("등록 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelFile = () => {
    setFile(null);
    setPreviewUrl("");
    setUploadedUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // input 초기화
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            상세 정보 #{plantId}
          </h2>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            id="physical"
            name="physical"
            value={form.physical}
            onChange={onChange}
            type="text"
            className="w-full rounded-xl border border-gray-300 p-3 text-sm 
            focus:outline-none focus:ring-2 focus:ring-sky-200 placeholder:font-semibold"
            placeholder="[필수] 생육 (예: 현재 크기, 성장 단계 등)"
            required
          />
          <input
            id="manage"
            name="manage"
            value={form.manage}
            onChange={onChange}
            type="text"
            className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
            placeholder="관리 (예: 물 주기, 가지치기 등)"
          />
          <input
            id="preferred"
            name="preferred"
            value={form.preferred}
            onChange={onChange}
            type="text"
            className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
            placeholder="환경 (예: 온도, 습도, 일조량)"
          />
          <input
            id="careNotes"
            name="careNotes"
            value={form.careNotes}
            onChange={onChange}
            type="text"
            className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
            placeholder="특이 사항(예: 병충해 등)"
          />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">성장 기록</h2>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-[160px_1fr] gap-6 items-start">
            <div className="relative w-40 h-40 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <PiTrashBold
                    size={26}
                    className="absolute bottom-2 right-2 text-red-600 bg-white rounded-full p-1 hover:bg-red-100 cursor-pointer shadow-sm"
                    onClick={handleCancelFile}
                  />
                </>
              ) : (
                <span className="text-gray-400 text-sm">미리보기 없음</span>
              )}
            </div>

            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 shrink-0 w-20">
                  기록 날짜
                </span>
                <input
                  id="diaryDate"
                  name="diaryDate"
                  value={form.diaryDate}
                  onChange={onChange}
                  type="date"
                  className="flex-1 rounded-xl border border-gray-300 p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                />
              </div>

              <div className="flex items-center gap-4">
                <label
                  className="inline-flex items-center justify-center
                       h-[46px] flex-1
                       rounded-xl border border-dashed border-gray-300
                       text-sm text-gray-600 hover:border-gray-400 cursor-pointer
                       bg-white"
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {file ? `선택됨: ${file.name}` : "성장 사진 선택"}
                </label>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="사진 메모"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-center gap-3">
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
