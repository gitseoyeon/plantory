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
      //console.log("[Service]", diaryData);
      const created = await userPlantDiaryService.createDiary(diaryData);
      return created;
    } catch (err) {
      set({
        error:
          err?.response?.data?.message ??
          err?.message ??
          "성장 일지 가져오는데 실패 하였습니다.",
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  listPlantDiary: async (plantId, page = 0, size = 10) => {
    set({ loading: true, error: null });
    try {
      const data = await userPlantDiaryService.listPlantDiary(
        plantId,
        page,
        size
      );
      set({
        diaries: data.content ?? data, // 백엔드가 Page 형태로 줄 경우 대비
        pagination: {
          page: data.number ?? page,
          size: data.size ?? size,
          totalPages: data.totalPages ?? 1,
          totalElements: data.totalElements ?? 0,
        },
      });

      return data;
    } catch (err) {
      set({
        error:
          err?.response?.data?.message ??
          err?.message ??
          "Failed to load plant diaries",
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deleteDiary: async (plantId, diaryId) => {
    try {
      await userPlantDiaryService.deleteDiary(plantId, diaryId);
      set((state) => ({
        diaries: state.diaries.filter((d) => d.id !== diaryId),
      }));
    } catch (err) {
      console.error("[deleteDiary] 실패:", err);
      throw err;
    }
  },
}));

export default useUserPlantDiaryStore;
