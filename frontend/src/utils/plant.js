import { filterByKorean } from "./korean";

// 공통 문자열 정규화
export const normalizeName = (s) => (s ?? "").trim().toLowerCase();

// [{id, name}] → Map<lowerName, {id,name}>
export function buildSpeciesIndex(species = []) {
  const idx = new Map();
  for (const sp of species) {
    if (!sp?.name) continue;
    idx.set(normalizeName(sp.name), { id: sp.id, name: sp.name });
  }
  return idx;
}

// 이름으로 종 ID 찾기 (정확일치, 대/소문자/공백 무시)
export function getSpeciesIdByName(name, indexOrList) {
  if (!name) return null;
  const key = normalizeName(name);
  if (indexOrList instanceof Map) {
    return indexOrList.get(key)?.id ?? null;
  }
  // 리스트가 들어온 경우도 지원
  const found = (indexOrList || []).find(
    (sp) => normalizeName(sp.name) === key
  );
  return found?.id ?? null;
}

// 초성/부분 일치 추천 목록 (상위 limit개)
export function suggestSpecies(query, speciesList = [], limit = 8) {
  if (!query) return [];
  const filtered = filterByKorean(speciesList, query);
  return filtered.slice(0, limit);
}

// 폼 헬퍼들
export const parseBoolString = (v) => String(v) === "true";
export const toNumberOrNull = (v) => (v === "" || v == null ? null : Number(v));
export const trimOrNull = (v) => {
  const s = (v ?? "").trim();
  return s === "" ? null : s;
};

// Plant 등록 payload 빌더 (백엔드 DTO에 맞게 변환)
export function buildCreatePlantPayload(form) {
  return {
    species_id: form.speciesId ?? null,
    name: trimOrNull(form.name),
    petName: trimOrNull(form.petName),
    acquiredDate: form.acquiredDate || null,
    indoor: parseBoolString(form.indoor),
    location: trimOrNull(form.location),
    store: trimOrNull(form.store),
    price: toNumberOrNull(form.price),
    potSize: trimOrNull(form.potSize),
    imageUrl: trimOrNull(form.imageUrl),
  };
}
