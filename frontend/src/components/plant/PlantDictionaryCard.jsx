import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PlantDictionaryCard = ({ plant }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    console.log("🪴 클릭한 식물:", plant);
    navigate(`/dictionary/${plant.perenualId}`, {
      state: {
        fromSearch: true,
        query: new URLSearchParams(location.search).get("query") || "",
      },
    });
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white shadow-md rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition"
    >
      <img
        src={plant.imageUrl || "https://via.placeholder.com/200"}
        alt={plant.commonName || plant.koreanName || "식물 이미지"}
        className="w-full h-48 object-cover"
      />
      <div className="p-3">
        <h3 className="font-semibold text-gray-800">
          {plant.commonName || plant.koreanName || plant.englishName || "이름 없음"}
        </h3>
        <p className="text-sm text-gray-500 italic">
          {plant.scientificName || ""}
        </p>
      </div>
    </div>
  );
};

export default PlantDictionaryCard;
