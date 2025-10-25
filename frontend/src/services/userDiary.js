import api from "./api";

const userPlantDiaryService = {
  createDiary: async (data) => {
    //console.log("[service]", data);
    const res = await api.post(`/api/diary`, data);
    return res.data;
  },

  //갤러리형
  listAllDiaryPhotos: async (page = 0, size = 10) => {
    const res = await api.get(`/api/diary/photos`, {
      params: { page, size },
    });
    return res.data;
  },

  //목록형
  listAllPlantDiary: async (page = 0, size = 10) => {
    const res = await api.get(`/api/diary/all`, {
      params: { page, size },
    });
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
