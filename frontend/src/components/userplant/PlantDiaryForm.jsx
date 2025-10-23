import React, { useState } from "react";
import useUserPlantDiaryStore from "../../store/userDiaryStore";

const PlantDiaryForm = ({ onClose, onSuccess, plantId }) => {
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

  const uploadPlantPhoto = async (plantId, file) => {
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
      console.log(
        "[uploadPlantPhoto] 요청 URL:",
        uploadUrl,
        "plantId:",
        plantId,
        "file:",
        file.name
      );

      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("[uploadPlantPhoto] 서버 응답 오류:", res.status, text);
        throw new Error(`업로드 실패 (${res.status})`);
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        console.log("[uploadPlantPhoto] 서버 응답:", data);
        return data; // { imageUrl: "..." } 예상
      } else {
        const text = await res.text();
        console.error("[uploadPlantPhoto] JSON 아님:", text);
        throw new Error("서버가 JSON 대신 HTML을 반환했습니다.");
      }
    } catch (err) {
      console.error("[uploadPlantPhoto] 에러:", err);
      throw err;
    }
  };

  // 파일 선택
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    console.log("selectedFile:", selectedFile);
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));

    try {
      const res = await uploadPlantPhoto(plantId, selectedFile);
      setUploadedUrl(res.imageUrl || res.imageUrlPath || res.fileName || "");
      //console.log("업로드 완료 - imageUrl:", res);
      setForm((prev) => ({
        ...prev,
        userPlantPhotos: [{ imageUrl: res.imageUrl, memo }],
      }));
    } catch (err) {
      alert("이미지 업로드 실패: " + (err.message || err));
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
      //console.log("[payload]", payload);
      const res = await createDiary(payload);
      onSuccess?.(res);
      onClose?.();
    } catch (err) {
      console.error("[PlantDiaryForm] createDiary error:", err);
      alert("등록 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* 기본 정보 */}
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
            className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="[필수] 생육 (예: 현재 크기, 성장 단계 등)"
            required
          />
          <input
            id="manage"
            name="manage"
            value={form.manage}
            onChange={onChange}
            type="text"
            className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="관리 (예: 물 주기, 가지치기 등)"
          />
          <input
            id="preferred"
            name="preferred"
            value={form.preferred}
            onChange={onChange}
            type="text"
            className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="환경 (예: 온도, 습도, 일조량)"
          />
          <input
            id="careNotes"
            name="careNotes"
            value={form.careNotes}
            onChange={onChange}
            type="text"
            className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="특이 사항(예: 병충해 등)"
          />
        </div>
      </section>

      {/* 사진 + 메모 */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">성장 사진</h2>
        </div>

        <div className="p-5 space-y-4">
          <label className="inline-flex flex-col items-start gap-2 cursor-pointer">
            <span className="text-sm text-gray-600">사진 선택</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-full rounded-xl border border-dashed border-gray-300 p-3 text-sm text-gray-600 hover:border-gray-400 bg-white">
              {file ? file.name : "이미지 파일 선택"}
            </div>
          </label>

          {previewUrl && (
            <img
              src={previewUrl}
              alt="preview"
              className="w-32 h-32 object-cover rounded-lg border border-gray-200"
            />
          )}

          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="사진 메모"
          />
        </div>
      </section>

      {/* 저장/취소 버튼 */}
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
