import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useUserPlantStore from "../store/userPlantStore";
import noImage from "../assets/no_image.png";
import useUserPlantDiaryStore from "../store/userDiaryStore";

const PlantDetail = () => {
  const { plantId } = useParams();
  const location = useLocation();
  const passedPlant = location.state?.plant;
  const { getPlantById } = useUserPlantStore();
  const [plant, setPlant] = useState(passedPlant);
  const { listPlantDiary, diaries } = useUserPlantDiaryStore();

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

  useEffect(() => {
    if (plantId) listPlantDiary(plantId);
  }, [plantId, listPlantDiary]);

  if (!plant) {
    return (
      <div className="text-gray-600 p-6">🌱 식물 정보를 불러오는 중...</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-2xl p-6 mt-10 space-y-6">
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
            💵 가격 : {plant.price ? `${plant.price.toLocaleString()}원` : "-"}
          </span>
          <span>🪴 화분 크기 : {plant.potSizeLabel || "-"}</span>
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-sky-600 flex items-center gap-2">
          📖 성장일지
        </h2>

        {diaries.length === 0 ? (
          <p className="text-gray-500">아직 등록된 성장일지가 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {diaries.map((d) => (
              <li key={d.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">
                    {d.physical || "기록"}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {d.diaryDate || "-"}
                  </span>
                </div>
                <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                  {d.careNotes || "내용 없음"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default PlantDetail;
