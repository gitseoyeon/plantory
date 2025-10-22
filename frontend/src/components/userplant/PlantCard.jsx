import React from "react";
import { Link } from "react-router-dom";
import noImage from "../../assets/no_image.png";
import useAuthStore from "../../store/authStore";
import useUserPlantStore from "../../store/userPlantStore";

const PlantCard = ({ plant, onEdit, onDelete }) => {
  if (!plant) return null;
  const { user, isAuthenticated } = useAuthStore();
  const deletePlant = useUserPlantStore((s) => s.deletePlant);
  const loading = useUserPlantStore((s) => s.loading);

  const {
    id,
    name,
    petName,
    acquiredDate,
    imageUrl,
    indoor,
    store,
    price,
    speciesName,
    location,
    potSize,
    potSizeLabel,
    qrImageUrl,
    userId,
  } = plant;

  const canManage = isAuthenticated && user?.id === userId;

  const handleDelete = async () => {
    if (!canManage) return;
    if (!window.confirm("반려 식물을 삭제하시겠습니까?")) return;

    try {
      await deletePlant(plant.id);
    } catch (err) {
      console.error(err);
      alert("삭제에 실패했습니다. 다시 시도해 주세요.");
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-all">
      <div className="flex items-center gap-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <Link
              to={`/plant/${id ?? ""}`}
              state={{ plant }}
              className="font-semibold text-lg text-gray-800 hover:text-green-600 hover:underline truncate"
              title={name}
            >
              {name}
            </Link>
            {petName && (
              <span className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-2 py-0.5">
                {petName}
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1">
            {acquiredDate ? `구입/분양일: ${acquiredDate}` : "등록일 정보 없음"}
          </p>
        </div>
        {/* QR */}
        {qrImageUrl && (
          <div
            className="w-28 h-20 ml-auto bg-white rounded-lg overflow-hidden flex items-center
           justify-center border border-gray-100"
          >
            <img
              src={qrImageUrl}
              alt={`${name || "plant"} QR`}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = noImage;
              }}
            />
          </div>
        )}
        {/* 대표 사진 */}
        <div
          className="w-28 h-20 bg-green-100 rounded-lg overflow-hidden flex items-center 
        justify-center border border-gray-100"
        >
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
              className="w-full h-full object-cover opacity-80"
            />
          )}
        </div>
      </div>

      <div className="text-gray-700 text-sm leading-relaxed">
        {speciesName || location || potSize ? (
          <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
            {speciesName && (
              <span className="inline-flex items-center">
                <span className="text-gray-500 mr-1">종</span>
                <span className="font-medium">{speciesName}</span>
              </span>
            )}
            {location && (
              <span className="inline-flex items-center">
                <span className="text-gray-500 mr-1">위치</span>
                <span className="font-medium">{location}</span>
              </span>
            )}
            {potSize && (
              <span className="inline-flex items-center">
                <span className="text-gray-500 mr-1">화분</span>
                <span className="font-medium">{potSizeLabel}</span>
              </span>
            )}
          </div>
        ) : (
          "설명이 아직 없어요."
        )}
      </div>

      {/* 액션 */}
      <div className="flex items-center justify-between text-sm mt-2">
        <div className="flex gap-4 text-gray-500">
          <button className="hover:text-green-600 transition-colors">
            ❤️ 좋아요
          </button>
          <button className="hover:text-green-600 transition-colors">
            💬 댓글
          </button>
        </div>

        {canManage && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(plant)}
              className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            >
              수정
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-1 rounded-lg border border-red-200 text-red-600 bg-white hover:bg-red-50"
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantCard;
