import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

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


export const searchPlants = async ({ query }) => {
  try {
  
    const url = query
      ? `${API_BASE_URL}/plants/search?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/plants/search`;

    const response = await axios.get(url);
    console.log("🔍 검색 결과:", response.data);
    return response.data;
  } catch (error) {
    console.error("식물 검색 실패:", error);
    throw error;
  }
};
