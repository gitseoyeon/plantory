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

    @Value("${plantid.api.key}")
    private String apiKey;

    @Value("${plantid.api.base-url}")
    private String baseUrl;

    /**
     * ✅ DB에 데이터가 없으면 샘플 이미지로 자동 호출
     */
    public List<PlantIdentification> getOrFetchAllIdentifications() {
        List<PlantIdentification> existing = plantIdentificationRepository.findAll();
        if (!existing.isEmpty()) {
            log.info("✅ 기존 식별 데이터 존재 — 자동 호출 생략");
            return existing;
        }

        log.info("⚙️ DB 비어 있음 — 샘플 이미지로 자동 호출 실행");
        String sampleUrl = "https://upload.wikimedia.org/wikipedia/commons/3/36/Hydrangea_macrophylla2.jpg";
        identifyAndSaveFromUrl(sampleUrl);

        return plantIdentificationRepository.findAll();
    }

    /**
     * ✅ 업로드된 이미지 파일을 식별하고 결과 + 이미지 저장
     */
    public PlantIdentificationResponse identifyAndSave(MultipartFile image) {
        try {
            if (image == null || image.isEmpty()) {
                throw new RuntimeException("이미지 파일이 비어 있습니다.");
            }

            String contentType = image.getContentType();
            if (contentType == null ||
                !(contentType.equals("image/jpeg") || contentType.equals("image/png"))) {
                throw new RuntimeException("지원되지 않는 이미지 형식입니다. JPG 또는 PNG 파일을 업로드하세요.");
            }

            log.info("업로드된 파일: {} ({} bytes, type={})",
                image.getOriginalFilename(), image.getSize(), contentType);

            // ✅ 순수 Base64 인코딩 (data: prefix 제거)
            String base64 = Base64.getEncoder().encodeToString(image.getBytes());

            // ✅ v3 포맷: Plant.id는 'images', 'similar_images', 'classification_level'만 허용
            JSONObject requestJson = new JSONObject();
            requestJson.put("images", new JSONArray().put(base64));
            requestJson.put("similar_images", true);
            requestJson.put("classification_level", "species");

            log.info("📤 요청 JSON = {}", requestJson.toString(2));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Api-Key", apiKey);

            String apiUrl = baseUrl + "/identification";
            HttpEntity<String> request = new HttpEntity<>(requestJson.toString(), headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response =
                restTemplate.exchange(apiUrl, HttpMethod.POST, request, String.class);

            log.info("응답 코드: {}", response.getStatusCode());
            log.info("응답 본문: {}", response.getBody());

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("식별 API 호출 실패: " + response.getStatusCode());
            }

            JSONObject json = new JSONObject(response.getBody());
            JSONArray suggestions = json
                .optJSONObject("result")
                .optJSONObject("classification")
                .optJSONArray("suggestions");

            if (suggestions == null || suggestions.isEmpty()) {
                throw new RuntimeException("식별 결과를 찾을 수 없습니다.");
            }

            JSONObject first = suggestions.getJSONObject(0);
            String plantName = first.optString("name", "Unknown");
            double probability = first.optDouble("probability", 0) * 100;

            // ✅ 유사 이미지 추출
            String imageUrl = null;
            JSONArray similarImages = first.optJSONArray("similar_images");
            if (similarImages != null && !similarImages.isEmpty()) {
                imageUrl = similarImages.getJSONObject(0).optString("url", null);
            }

            PlantIdentification identification = PlantIdentification.builder()
                .identifiedName(plantName)
                .confidence(probability)
                .build();

            plantIdentificationRepository.save(identification);
            log.info("✅ 식물 식별 완료 및 저장: {} (정확도: {}%)", plantName, Math.round(probability));

            return new PlantIdentificationResponse(
                plantName,
                Math.round(probability) + "%",
                imageUrl
            );

        } catch (Exception e) {
            log.error("식별 API 호출 실패: {}", e.getMessage());
            throw new RuntimeException("식별 API 호출 실패: " + e.getMessage());
        }
    }

    /**
     * ✅ 자동 호출용 (URL 기반 식별)
     */
    private void identifyAndSaveFromUrl(String imageUrl) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String apiUrl = baseUrl + "/identification";

            JSONObject requestJson = new JSONObject();
            requestJson.put("images", new JSONArray(List.of(imageUrl)));
            requestJson.put("similar_images", true);
            requestJson.put("classification_level", "species");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Api-Key", apiKey);

            HttpEntity<String> requestEntity = new HttpEntity<>(requestJson.toString(), headers);
            ResponseEntity<String> responseEntity =
                restTemplate.exchange(apiUrl, HttpMethod.POST, requestEntity, String.class);

            if (responseEntity.getStatusCode() == HttpStatus.OK) {
                JSONObject json = new JSONObject(responseEntity.getBody());
                JSONArray suggestions = json
                    .optJSONObject("result")
                    .optJSONObject("classification")
                    .optJSONArray("suggestions");

                if (suggestions != null && !suggestions.isEmpty()) {
                    JSONObject first = suggestions.getJSONObject(0);
                    String plantName = first.optString("name", "Unknown");
                    double probability = first.optDouble("probability", 0) * 100;

                    PlantIdentification identification = PlantIdentification.builder()
                        .identifiedName(plantName)
                        .confidence(probability)
                        .build();

                    plantIdentificationRepository.save(identification);
                    log.info("✅ 자동 식별 완료: {}", plantName);
                }
            } else {
                log.error("자동 식별 실패: {}", responseEntity.getStatusCode());
            }
        } catch (Exception e) {
            log.error("자동 식별 중 오류 발생: {}", e.getMessage());
        }
    }
}
