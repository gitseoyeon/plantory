import React from "react";
import noImage from "../../assets/no_image.png";

const PlantCard = ({ plant }) => {
  if (!plant) return null;

  const {
    name,
    petName,
    acquiredDate,
    imageUrl,
    speciesName,
    location,
    potSize,
  } = plant;

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-all">
      {/* 상단 영역 */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">
            {name}
            {petName && (
              <span className="ml-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-2 py-0.5 align-middle">
                {petName}
              </span>
            )}
          </h3>
          <p className="text-gray-500 text-sm">
            {acquiredDate ? `구입/분양일: ${acquiredDate}` : "등록일 정보 없음"}
          </p>
        </div>

        <div className="w-28 h-20 bg-green-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name || "plant"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = noImage;
              }}
            />
          ) : (
            <img
              src={noImage}
              alt="이미지 없음"
              className="w-32 h-32 object-cover rounded-md opacity-80"
            />
          )}
        </div>
      </div>

      {/* 본문 */}
      <p className="text-gray-700 text-sm leading-relaxed">
        {speciesName ? `종: ${speciesName} · ` : ""}
        {location ? `위치: ${location} · ` : ""}
        {potSize ? `화분: ${potSize}` : ""}
        {!speciesName && !location && !potSize && "설명이 아직 없어요."}
      </p>

      {/* 액션 */}
      <div className="flex gap-4 text-sm text-gray-500 mt-2">
        <button className="hover:text-green-600 transition-colors">
          ❤️ 좋아요
        </button>
        <button className="hover:text-green-600 transition-colors">
          💬 댓글
        </button>
      </div>
    </div>
  );
};

export default PlantCard;
