// src/components/plant/PlantIdentificationResult.jsx
import React from "react";

const PlantIdentificationResult = ({ result }) => {
  if (!result) return null;

  return (
    <div className="mt-6 p-6 bg-white shadow-md rounded-xl">
      <h3 className="text-lg font-semibold text-green-700 mb-2">
        🌱 식별 결과
      </h3>
      <p><strong>이름:</strong> {result.name || "알 수 없음"}</p>
      <p><strong>정확도:</strong> {result.accuracy ? `${result.accuracy}%` : "N/A"}</p>
      {result.image_url && (
        <img
          src={result.image_url}
          alt={result.name}
          className="mt-3 w-64 rounded-xl"
        />
      )}
    </div>
  );
};

export default PlantIdentificationResult;
