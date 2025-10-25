import React from "react";

const PlantIdentificationResult = ({ result }) => {
  if (!result) return null;

  const { koreanName, englishName, confidence, imageUrl, previewUrl } = result;

  return (
    <div className="mt-10 bg-white p-8 rounded-2xl shadow-lg">
      <h4 className="text-2xl font-bold text-green-800 mb-6 text-center">
        🌱 식별 결과
      </h4>

      <div className="flex flex-col md:flex-row justify-center items-center gap-10">
        {/* 업로드한 이미지 */}
        {previewUrl && (
          <div className="flex flex-col items-center">
            <p className="text-lg text-gray-700 mb-3 font-medium">
              📸 업로드한 이미지
            </p>
            <img
              src={previewUrl}
              alt="Uploaded"
              className="rounded-xl shadow-md w-80 h-80 object-cover border border-gray-200"
            />
          </div>
        )}

        {/* AI 식별 결과 이미지 */}
        {imageUrl && (
          <div className="flex flex-col items-center">
            <p className="text-lg text-gray-700 mb-3 font-medium">
              🤖 AI 식별 결과 이미지
            </p>
            <img
              src={imageUrl}
              alt={koreanName || "AI result"}
              className="rounded-xl shadow-md w-80 h-80 object-cover border border-gray-200"
            />
          </div>
        )}
      </div>

      <div className="mt-8 text-center space-y-2">
        <p className="text-xl font-semibold text-gray-800">
          <span className="text-green-700 font-bold">이름:</span>{" "}
          {koreanName || "-"}
        </p>
        <p className="text-xl font-semibold text-gray-800">
          <span className="text-green-700 font-bold">영문명:</span>{" "}
          {englishName || "-"}
        </p>
        <p className="text-xl font-semibold text-gray-800">
          <span className="text-green-700 font-bold">정확도:</span>{" "}
          {confidence ? confidence.toFixed(2) + "%" : "-"}
        </p>
      </div>
    </div>
  );
};

export default PlantIdentificationResult;
