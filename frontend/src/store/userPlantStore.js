// src/store/userPlantStore.js
import { create } from "zustand";
import userplantService from "../services/userplant"; // ✅ default import

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
      const res = await userplantService.getAllPlants(page, size);
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

  listMyPlants: async (page = 0, size = 10) => {
    set({ loading: true, error: null });
    try {
      const res = await userplantService.getMyPlants(page, size);
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

  // 생성
  createPlant: async (payload) => {
    set({ loading: true, error: null });
    try {
      const created = await userplantService.createPlant(payload);
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

  // 수정
  updatePlant: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const updated = await userplantService.updatePlant(id, payload);
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

  // 삭제
  deletePlant: async (id) => {
    set({ loading: true, error: null });
    try {
      await userplantService.deletePlant(id);
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
      const data = await userplantService.getListSpecies();
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

  listPotSize: async () => {
    set({ loading: true, error: null });
    try {
      const data = await userplantService.getListPotSize();
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
