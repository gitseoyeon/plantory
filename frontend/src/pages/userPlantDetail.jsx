import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import useUserPlantStore from "../store/userPlantStore";
import noImage from "../assets/no_image.png";
import useUserPlantDiaryStore from "../store/userDiaryStore";
import PlantDiaryList from "../components/userplant/PlantDiaryList";
import { IoMdArrowRoundBack } from "react-icons/io";

const PlantDetail = () => {
  const { plantId } = useParams();
  const location = useLocation();
  const passedPlant = location.state?.plant;
  const getPlantById = useUserPlantStore((s) => s.getPlantById);
  const diaries = useUserPlantDiaryStore((s) => s.diaries);
  const listPlantDiary = useUserPlantDiaryStore((s) => s.listPlantDiary);
  const navigate = useNavigate();

  const [plant, setPlant] = useState(passedPlant);

  useEffect(() => {
    if (!passedPlant && plantId) {
      //처음한번은 목록에서 받고, 사용자가 새로고침할경우 처리
      const fetchPlant = async () => {
        try {
          const data = await getPlantById(plantId);
          setPlant(data);
        } catch (err) {
          console.error("식물 정보 불러오기 실패:", err);
        }
      };
      fetchPlant();
    }
  }, [plantId, passedPlant, getPlantById]);

  const loadDiaries = async () => {
    try {
      await listPlantDiary(plantId);
    } catch (err) {
      console.error("다이어리 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    if (plantId) loadDiaries();
  }, [plantId]);

  const handleDelete = async () => {
    await loadDiaries(); // 삭제 후 다시 불러오기
  };

  if (!plant) {
    return (
      <div className="text-gray-600 p-6">🌱 식물 정보를 불러오는 중...</div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 px-39">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-green-700">
          🌻 <span>사용자 식물 상세보기</span>
        </h1>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-all"
          title="뒤로가기"
        >
          <IoMdArrowRoundBack size={30} />
        </button>
      </div>
      <div className="max-w-3xl mx-auto shadow-sm border border-gray-200 rounded-2xl p-6 mt-10 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {plant.name || "이름 없음"}
            </h1>
            {plant.petName && (
              <p className="text-xl text-green-700 mt-1 font-medium  bg-green-50 border border-green-200 rounded-md px-2 py-0.5">
                {plant.petName}
              </p>
            )}
            <p className="text-gray-500 text-sm mt-1 flex items-center  gap-10">
              <span>🌿 종 : {plant.speciesName || "-"}</span>
              <span>
                {plant.acquiredDate
                  ? ` 구입일/분양일 : ${plant.acquiredDate}`
                  : "-"}
              </span>
            </p>
          </div>

          {plant.qrImageUrl && (
            <div className="w-28 h-28 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
              <img
                src={plant.qrImageUrl}
                alt="QR 코드"
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = noImage;
                }}
              />
            </div>
          )}
        </div>
        <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden">
          <img
            src={plant.imageUrl || noImage}
            alt={plant.name || "plant"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = noImage;
            }}
          />
        </div>
        <div className="text-gray-700 text-base space-y-2">
          <p className="flex items-center gap-10">
            <span>📍 위치 : {plant.location || "-"}</span>
            <span>🏪 구입처 : {plant.store || "-"}</span>
          </p>
          <p className="flex items-center gap-10">
            <span>
              💵 가격 :{" "}
              {plant.price ? `${plant.price.toLocaleString()}원` : "-"}
            </span>
            <span>🪴 화분 크기 : {plant.potSizeLabel || "-"}</span>
          </p>
        </div>

        <PlantDiaryList
          page={diaries}
          plantOwnerId={plant.userId}
          plantId={plantId}
          onEdit={(d) => {
            alert("준비중입니다.");
          }}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default PlantDetail;
