import React, { useState } from "react";
import axios from "axios";

const PlantIdentificationUpload = ({ onResult }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다!");
      return;
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return alert("이미지를 선택해주세요!");

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/identification/identify",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      onResult?.({ ...response.data, previewUrl });
    } catch (err) {
      console.error("❌ 식물 식별 실패:", err);
      alert("식물 식별 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-green-50 p-8 rounded-xl shadow-md text-center">
      <h3 className="text-2xl font-bold text-green-700 mb-6">🌿 AI 식물 식별</h3>

      {/* ✅ 파일 업로드 버튼 대체 */}
      <div className="flex flex-col items-center justify-center mb-4">
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-green-100 hover:bg-green-200 text-green-700 font-medium py-2 px-4 rounded-lg shadow-sm transition"
        >
          📁 파일 선택
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <p className="text-gray-600 text-sm mt-3 max-w-[250px] text-ellipsis overflow-hidden truncate">
          {file ? `선택된 파일: ${file.name}` : "선택된 파일 없음"}
        </p>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-green-600 text-white py-2 px-5 rounded-lg hover:bg-green-700 disabled:opacity-60"
      >
        {loading ? "식별 중..." : "AI로 식물 식별하기"}
      </button>
    </div>
  );
};

export default PlantIdentificationUpload;
