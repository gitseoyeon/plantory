import React, { useState } from "react";
import PlantIdentificationUpload from "../components/plant/PlantIdentificationUpload";
import PlantIdentificationResult from "../components/plant/PlantIdentificationResult";

const PlantIdentification = () => {
  const [result, setResult] = useState(null);

  const handleResult = (data) => {
    console.log("📥 부모가 받은 결과:", data);
    setResult(data);
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold text-green-700 mb-6">🌿 AI 식물 식별</h2>
      <PlantIdentificationUpload onResult={handleResult} />
      {result && <PlantIdentificationResult result={result} />}
    </div>
  );
};

export default PlantIdentification;
