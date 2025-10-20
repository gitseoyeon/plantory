import React from "react";

const PlantCard = ({ plant }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 hover:shadow-lg transition">
      <img
        src={plant.imageUrl || "/placeholder.png"}
        alt={plant.name}
        className="w-full h-40 object-cover rounded-xl mb-3"
      />
      <h2 className="text-lg font-semibold">{plant.name}</h2>
      <p className="text-sm text-gray-500">{plant.scientificName}</p>
    </div>
  );
};

export default PlantCard;
