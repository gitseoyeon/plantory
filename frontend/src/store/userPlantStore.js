import { create } from "zustand";
import userPlantService from "../services/userplant";
import userPlantDiaryService from "../services/userDiary";

const useUserPlantStore = create((set, get) => ({
  plants: [],
  species: [],
  potSizes: [],
  loading: false,
  error: null,
  pagination: { page: 0, size: 10, totalElements: 0, totalPages: 0 },

  listAllPlants: async (page = 0, size = 10) => {
    set({ loading: true, error: null });
    try {
      const res = await userPlantService.getAllPlants(page, size);
      const content = Array.isArray(res?.content)
        ? res.content
        : Array.isArray(res)
        ? res
        : [];

      set((state) => ({
        // page===0이면 갈아끼우고, 그 외에는 누적
        plants: page === 0 ? content : [...state.plants, ...content],
        loading: false,
        pagination: {
          page: res?.number ?? page,
          size: res?.size ?? size,
          totalElements:
            res?.totalElements ??
            (page === 0 ? content.length : state.pagination.totalElements),
          totalPages: res?.totalPages ?? state.pagination.totalPages ?? 1,
        },
      }));
      return content;
    } catch (err) {
      set({
        loading: false,
        error:
          err?.response?.data?.message ??
          err?.message ??
          "Failed to load plants",
        plants: page === 0 ? [] : get().plants, // 첫 페이지 실패면 비우고, 아닐 땐 유지
      });
      return [];
    }
  },

  listMyPlants: async (page = 0, size = 10) => {
    set({ loading: true, error: null });
    try {
      const res = await userPlantService.getMyPlants(page, size);
      const content = Array.isArray(res?.content)
        ? res.content
        : Array.isArray(res)
        ? res
        : [];
      set({
        plants: content,
        loading: false,
        pagination: {
          page: res?.number ?? page,
          size: res?.size ?? size,
          totalElements: res?.totalElements ?? content.length,
          totalPages: res?.totalPages ?? 1,
        },
      });
      return content;
    } catch (err) {
      set({
        loading: false,
        error:
          err?.response?.data?.message ??
          err?.message ??
          "Failed to load plants",
        plants: [],
      });
      return [];
    }
  },

  getPlantById: async (plantId) => {
    set({ loading: true, error: null });
    try {
      const res = await userPlantService.getPlantById(plantId);
      const plantData = res?.data ?? res;
      set({ plant: plantData, loading: false });
      return plantData;
    } catch (err) {
      console.error("식물 조회 실패:", err);
      set({ error: err, loading: false });
      throw err;
    }
  },
  createPlant: async (payload) => {
    set({ loading: true, error: null });
    try {
      const created = await userPlantService.createPlant(payload);
      set((state) => ({
        plants: [created, ...state.plants],
        loading: false,
      }));
      return created;
    } catch (err) {
      set({
        loading: false,
        error:
          err?.response?.data?.message ??
          err?.message ??
          "Failed to create plant",
      });
      throw err;
    }
  },

  updatePlant: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const updated = await userPlantService.updatePlant(id, payload);
      set((state) => ({
        plants: state.plants.map((p) => (p.id === id ? updated : p)),
        loading: false,
      }));
      return updated;
    } catch (err) {
      set({
        loading: false,
        error:
          err?.response?.data?.message ??
          err?.message ??
          "Failed to update plant",
      });
      throw err;
    }
  },

  deletePlant: async (id) => {
    set({ loading: true, error: null });
    try {
      await userPlantService.deletePlant(id);
      set((state) => ({
        plants: state.plants.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({
        loading: false,
        error:
          err?.response?.data?.message ??
          err?.message ??
          "Failed to delete plant",
      });
      throw err;
    }
  },

  // 종 목록
  listSpecies: async () => {
    set({ loading: true, error: null });
    try {
      const data = await userPlantService.getListSpecies();
      const list = Array.isArray(data) ? data : [];
      set({ species: list, loading: false });
      return list;
    } catch (err) {
      set({
        loading: false,
        error:
          err?.response?.data?.message ??
          err?.message ??
          "Failed to load species",
        species: [],
      });
      return [];
    }
  },

  //화분크기
  listPotSize: async () => {
    set({ loading: true, error: null });
    try {
      const data = await userPlantService.getListPotSize();
      const list = Array.isArray(data) ? data : [];
      set({ potSizes: list, loading: false });
      return list;
    } catch (err) {
      set({
        loading: false,
        error:
          err?.response?.data?.message ??
          err?.message ??
          "Failed to load pot sizes",
        potSizes: [],
      });
      return [];
    }
  },
}));

export default useUserPlantStore;
