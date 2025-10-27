import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL + "/api";

export const getPlantsByPage = (page = 0, size = 20, query = "") => {
  const url = `${API_BASE_URL}/plants/page?page=${page}&size=${size}&query=${encodeURIComponent(
    query
  )}`;
  return axios.get(url);
};
