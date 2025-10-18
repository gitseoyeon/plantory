import api from "./api";

const userplantService = {
  createPlant: async (data) => {
    const res = await api.post("/api/plant", data);
    return res.data;
  },

  getMyPlants: async (page = 0, size = 10) => {
    const res = await api.get("/api/plant", { params: { page, size } });
    return res.data;
  },

  updatePlant: async (plantId, data) => {
    const res = await api.put(`/api/plant/${plantId}`, data);
    return res.data;
  },

  deletePlant: async (plantId) => {
    await api.delete(`/api/plant/${plantId}`);
  },

  //유저식물 종
  getListSpecies: async () => {
    const res = await api.get(`/api/plant/species`);
    return (await res).data;
  },

  //화분크기
  getListPotSize: async () => {
    const res = await api.get("/api/plant/potsize");
    return res.data;
  },
};

export default userplantService;
