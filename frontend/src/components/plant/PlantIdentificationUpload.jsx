// src/components/plant/PlantIdentificationUpload.jsx
import React, { useState } from "react";
import axios from "axios";

const PlantIdentificationUpload = ({ onResult }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("이미지를 선택해주세요!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/identification/identify",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      onResult(response.data);
    } catch (error) {
      console.error("식물 식별 실패:", error);
      alert("식물 식별 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-green-50 p-6 rounded-xl shadow-md text-center">
      <h3 className="text-xl font-semibold text-green-700 mb-3">
        🌿 식물 이미지 업로드
      </h3>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
      >
        {loading ? "식별 중..." : "AI로 식물 식별하기"}
      </button>
    </div>
  );
};

export default PlantIdentificationUpload;
