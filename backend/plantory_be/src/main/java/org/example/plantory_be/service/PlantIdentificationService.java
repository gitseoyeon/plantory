package org.example.plantory_be.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.plantory_be.dto.response.PlantIdentificationResponse;
import org.example.plantory_be.entity.PlantIdentification;
import org.example.plantory_be.repository.PlantIdentificationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlantIdentificationService {

    private final PlantIdentificationRepository plantIdentificationRepository;

    @Value("${plantid.api.key}")
    private String apiKey;

    @Value("${plantid.api.base-url}")
    private String baseUrl;

    /**
     * [자동 호출]
     * DB가 비어 있으면 Plant.id API를 자동 호출하여 초기 데이터 생성
     */
    public List<PlantIdentification> getOrFetchAllIdentifications() {
        List<PlantIdentification> existing = plantIdentificationRepository.findAll();

        if (!existing.isEmpty()) {
            log.info("기존 식별 데이터가 존재합니다. 자동 호출 생략.");
            return existing;
        }

        log.info("⚙️ DB 비어 있음 → Plant.id API 자동 호출 시작");
        // 샘플 이미지 URL (테스트용)
        String sampleImageUrl = "https://example.com/sample-plant.jpg";
        identifyAndSaveFromUrl(sampleImageUrl);

        return plantIdentificationRepository.findAll();
    }

    /**
     * [수동 호출]
     * 사용자가 업로드한 이미지로 식물 식별
     */
    public PlantIdentificationResponse identifyAndSave(MultipartFile image) {
        try {
            byte[] imageBytes = image.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            RestTemplate restTemplate = new RestTemplate();
            String apiUrl = baseUrl + "/identify";

            // 요청 바디 구성
            var request = new java.util.HashMap<String, Object>();
            request.put("api_key", apiKey);
            request.put("images", List.of(base64Image));

            var response = restTemplate.postForObject(apiUrl, request, org.json.JSONObject.class);

            if (response == null) {
                throw new RuntimeException("AI 응답이 null입니다.");
            }

            // 예시 응답 파싱
            String plantName = response.getJSONArray("suggestions")
                .getJSONObject(0)
                .getJSONObject("plant")
                .getString("name");

            double probability = response.getJSONArray("suggestions")
                .getJSONObject(0)
                .getDouble("probability");

            // DB 저장 (엔티티 필드명 기준)
            PlantIdentification identification = PlantIdentification.builder()
                .identifiedName(plantName)
                .confidence(probability * 100)
                .build();

            plantIdentificationRepository.save(identification);

            // 응답 DTO는 문자열 퍼센트 형태로 반환
            return new PlantIdentificationResponse(plantName, Math.round(probability * 100) + "%");

        } catch (IOException e) {
            throw new RuntimeException("이미지 변환 실패: " + e.getMessage());
        } catch (Exception e) {
            log.error("식별 API 호출 실패: {}", e.getMessage());
            throw new RuntimeException("식별 API 호출 실패");
        }
    }

    /**
     * [내부 자동 호출 전용: URL 기반 요청]
     */
    private void identifyAndSaveFromUrl(String imageUrl) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String apiUrl = baseUrl + "/identify-url";

            var request = new java.util.HashMap<String, Object>();
            request.put("api_key", apiKey);
            request.put("images", List.of(imageUrl));

            var response = restTemplate.postForObject(apiUrl, request, org.json.JSONObject.class);

            if (response == null) {
                throw new RuntimeException("AI 응답이 null입니다.");
            }

            String plantName = response.getJSONArray("suggestions")
                .getJSONObject(0)
                .getJSONObject("plant")
                .getString("name");

            double probability = response.getJSONArray("suggestions")
                .getJSONObject(0)
                .getDouble("probability");

            PlantIdentification identification = PlantIdentification.builder()
                .identifiedName(plantName)
                .confidence(probability * 100)
                .build();

            plantIdentificationRepository.save(identification);
            log.info("자동 식별 데이터 저장 완료: {}", plantName);

        } catch (Exception e) {
            log.error("자동 식별 중 오류 발생: {}", e.getMessage());
        }
    }
}
