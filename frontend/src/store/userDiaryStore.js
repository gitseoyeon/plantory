import { create } from "zustand";
import userPlantDiaryService from "../services/userDiary";

const useUserPlantDiaryStore = create((set, get) => ({
  diaries: [],
  loading: false,
  error: null,
  pagination: { page: 0, size: 10 },

  createDiary: async (diaryData) => {
    set({ loading: true, error: null });
    try {
      const created = await userPlantDiaryService.createDiary(diaryData);
      return created;
    } catch (err) {
      set({
        error:
          err?.response?.data?.message ??
          err?.message ??
          "Failed to create plantDiary",
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useUserPlantDiaryStore;
