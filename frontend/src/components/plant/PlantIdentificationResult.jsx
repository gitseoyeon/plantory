import React from "react";

const PlantIdentificationResult = ({ result }) => {
  if (!result) return null;

  const { plantName, confidence, imageUrl, previewUrl } = result;

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h4 className="text-xl font-semibold text-green-800 mb-4">🌱 식별 결과</h4>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6">
        {previewUrl && (
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-2">📸 업로드한 이미지</p>
            <img
              src={previewUrl}
              alt="Uploaded"
              className="rounded-lg shadow-md w-48 h-48 object-cover"
            />
          </div>
        )}

        {imageUrl && (
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-2">🤖 AI 식별 결과 이미지</p>
            <img
              src={imageUrl}
              alt={plantName || "AI result"}
              className="rounded-lg shadow-md w-48 h-48 object-cover"
            />
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-lg font-medium">
          <span className="text-green-700 font-bold">이름:</span>{" "}
          {plantName || "-"}
        </p>
        <p className="text-gray-700">
          <span className="text-green-700 font-bold">정확도:</span>{" "}
          {confidence ?? "-"}
        </p>
      </div>
    </div>
  );
};

export default PlantIdentificationResult;
