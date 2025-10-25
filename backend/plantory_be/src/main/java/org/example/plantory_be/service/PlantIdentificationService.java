package org.example.plantory_be.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.plantory_be.dto.response.PlantIdentificationResponse;
import org.example.plantory_be.entity.PlantIdentification;
import org.example.plantory_be.repository.PlantIdentificationRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlantIdentificationService {

    private final PlantIdentificationRepository plantIdentificationRepository;
    private final PapagoTranslationService papagoTranslationService;

    @Value("${plantid.api.key}")
    private String apiKey;

    @Value("${plantid.api.base-url}")
    private String baseUrl;

    /**
     * ✅ 식물 이미지 식별 요청
     */
    public PlantIdentificationResponse identifyPlant(MultipartFile file) {
        try {
            // 1️⃣ 이미지 → Base64 인코딩
            byte[] imageBytes = file.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            // 2️⃣ 요청 JSON 생성
            JSONObject requestBody = new JSONObject();
            requestBody.put("images", List.of(base64Image));
            requestBody.put("similar_images", true);
            requestBody.put("classification_level", "species");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Api-Key", apiKey);

            HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);
            RestTemplate restTemplate = new RestTemplate();

            // 3️⃣ API 요청
            ResponseEntity<String> response = restTemplate.exchange(
                baseUrl,
                HttpMethod.POST,
                entity,
                String.class
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                log.error("❌ 식별 요청 실패: {}", response.getStatusCode());
                return new PlantIdentificationResponse("에러", "-", 0.0, null, null);
            }

            JSONObject jsonResponse = new JSONObject(response.getBody());
            log.info("✅ Plant.id 응답 수신: {}", jsonResponse);

            // 4️⃣ 결과 파싱
            JSONObject resultObj = jsonResponse.optJSONObject("result");
            if (resultObj == null)
                return new PlantIdentificationResponse("에러", "-", 0.0, null, null);

            JSONObject classification = resultObj.optJSONObject("classification");
            if (classification == null)
                return new PlantIdentificationResponse("에러", "-", 0.0, null, null);

            JSONArray suggestions = classification.optJSONArray("suggestions");
            if (suggestions == null || suggestions.isEmpty())
                return new PlantIdentificationResponse("결과 없음", "-", 0.0, null, null);

            JSONObject firstSuggestion = suggestions.getJSONObject(0);

            // 5️⃣ 정보 추출
            String englishName = firstSuggestion.optString("name", "Unknown");
            double confidence = firstSuggestion.optDouble("probability", 0.0) * 100;
            String koreanName = papagoTranslationService.translateToKorean(englishName);

            // ✅ 유사 이미지
            JSONArray similarImages = firstSuggestion.optJSONArray("similar_images");
            String resultImageUrl = null;
            if (similarImages != null && similarImages.length() > 0) {
                resultImageUrl = similarImages.getJSONObject(0).optString("url", null);
            }

            // 6️⃣ DB 저장
            PlantIdentification saved = plantIdentificationRepository.save(
                PlantIdentification.builder()
                    .previewUrl("data:image/jpeg;base64," + base64Image)
                    .imageUrl(resultImageUrl)
                    .englishName(englishName)
                    .identifiedName(koreanName)
                    .confidence(confidence)
                    .build()
            );

            // 7️⃣ 결과 반환
            return new PlantIdentificationResponse(
                koreanName,                 // 번역된 이름
                englishName,                // 영어 이름
                confidence,                 // 정확도
                saved.getPreviewUrl(),      // 업로드 이미지
                saved.getImageUrl()         // 결과 이미지
            );

        } catch (Exception e) {
            log.error("❌ 식별 중 오류: {}", e.getMessage());
            return new PlantIdentificationResponse("에러", "-", 0.0, null, null);
        }
    }

    /**
     * ✅ 전체 식별 이력 조회
     */
    public List<PlantIdentification> getAllIdentifications() {
        return plantIdentificationRepository.findAll();
    }
}
