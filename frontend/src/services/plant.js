import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// 전체 식물 목록 조회
export const getAllPlants = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/plants`);
    console.log("🌿 받아온 식물 데이터:", response.data);
    return response.data;
  } catch (error) {
    console.error("식물 목록 조회 실패:", error);
    throw error;
  }
};

// 특정 식물 상세 조회
export const getPlantById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/plants/${id}`);
    console.log(`🌱 ${id}번 식물 데이터:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`식물 상세 조회 실패 (ID: ${id})`, error);
    throw error;
  }
};
