// src/utils/korean.js

// 한글 초성 테이블
const CHO = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

/** 문자열 → 초성 문자열로 변환 */
export function toChosung(input = "") {
  return Array.from(input)
    .map((ch) => {
      const code = ch.charCodeAt(0) - 0xac00;
      if (code < 0 || code > 11171) return ch; // 한글 음절 아니면 그대로
      return CHO[Math.floor(code / 588)] ?? ch;
    })
    .join("");
}

/** 부분/초성 검색: query 가 target 의 내용/초성에 포함되는지 */
export function matchKoreanQuery(target, query) {
  const t = (target ?? "").trim().toLowerCase();
  const q = (query ?? "").trim().toLowerCase();
  if (!q) return true;
  if (t.includes(q)) return true;

  const tCho = toChosung(t).toLowerCase();
  const qCho = toChosung(q).toLowerCase();
  return tCho.includes(qCho);
}

/** 리스트 필터링 헬퍼 (item.name 기준) */
export function filterByKorean(list = [], query = "") {
  return list.filter((item) => matchKoreanQuery(item?.name ?? "", query));
}
