import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PlantDictionaryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlantDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/plants/perenual/${id}`
        );
        console.log("🌱 상세조회 데이터:", response.data);
        setPlant(response.data);
      } catch (err) {
        console.error("식물 상세 조회 실패:", err);
        setError("식물 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlantDetail();
  }, [id]);

  if (loading) return <p className="text-center mt-10">로딩 중...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!plant) return <p className="text-center mt-10">식물 정보를 찾을 수 없습니다.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-green-600 hover:text-green-800 transition"
      >
        ← 목록으로 돌아가기
      </button>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <img
          src={plant.imageUrl || "https://via.placeholder.com/400"}
          alt={plant.commonName || "식물 이미지"}
          className="w-full h-80 object-cover"
        />

        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {plant.commonName || "이름 없음"}
          </h2>
          <p className="text-gray-500 italic mb-4">
            {plant.scientificName || ""}
          </p>

          <div className="text-gray-700 space-y-2">
            <p>
              <strong>다른 이름:</strong> {plant.otherName || "정보 없음"}
            </p>
            <p>
              <strong>원산지:</strong> {plant.origin || "정보 없음"}
            </p>
            <p>
              <strong>물 주기:</strong> {plant.water || "정보 없음"}
            </p>
            <p>
              <strong>햇빛:</strong> {plant.sunlight || "정보 없음"}
            </p>
            <p>
              <strong>토양:</strong> {plant.soil || "정보 없음"}
            </p>
            <p>
              <strong>설명:</strong>{" "}
              {plant.description || "등록된 설명이 없습니다."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDictionaryDetail;
