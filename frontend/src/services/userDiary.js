import api from "./api";

const userPlantDiaryService = {
  createDiary: async (data) => {
    //console.log("[service]", data);
    const res = await api.post(`/api/diary`, data);
    return res.data;
  },

  listPlantDiary: async (plantId, page = 0, size = 10) => {
    const res = await api.get(`/api/diary/${plantId}`, {
      params: { page, size },
    });
    return res.data;
  },

  updateDiary: async (diaryId, data) => {
    const res = await api.put(`/api/diary/${plantId}/${diaryId}`, data);
    return res.data;
  },

  deleteDiary: async (plantId, diaryId) => {
    await api.delete(`/api/diary/${plantId}/${diaryId}`);
  },
};

export default userPlantDiaryService;
