import React from "react";
import { useNavigate } from "react-router-dom";

const PlantDictionaryCard = ({ plant }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/plants/${plant.perenualId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl shadow p-4 hover:shadow-lg transition cursor-pointer"
    >
      <img
        src={plant.imageUrl || "/placeholder.png"}
        alt={plant.commonName}
        className="w-full h-40 object-cover rounded-xl mb-3"
      />
      <h2 className="text-lg font-semibold">{plant.commonName || "이름 없음"}</h2>
      <p className="text-sm text-gray-500">{plant.scientificName || ""}</p>
    </div>
  );
};

export default PlantDictionaryCard;
