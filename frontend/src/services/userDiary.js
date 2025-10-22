import api from "./api";

const userPlantDiaryService = {
  createDiary: async (data) => {
    const res = await api.post("/api/diary", data);
    return res.data;
  },

  getAllPlantDiary: async (page = 0, size = 10) => {
    const res = await api.get("/api/diary/${plantId}", {
      params: { page, size },
    });
    return res.data;
  },

  updateDiary: async (diaryId, data) => {
    const res = await api.put(`/api/plant/${plantId}/${diaryId}`, data);
    return res.data;
  },

  deletePlant: async (diaryId) => {
    await api.delete(`/api/plant/${plantId}/${diaryId}`);
  },
};

export default userPlantDiaryService;
