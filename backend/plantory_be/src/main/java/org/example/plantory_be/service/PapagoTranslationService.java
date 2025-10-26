package org.example.plantory_be.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class PapagoTranslationService {

    @Value("${papago.api-url}")
    private String apiUrl;

    @Value("${papago.client-id}")
    private String clientId;

    @Value("${papago.client-secret}")
    private String clientSecret;

    /**
     * 영어 → 한국어 번역 (Papago Text Translation)
     */
    public String translateToKorean(String text) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("X-NCP-APIGW-API-KEY-ID", clientId);
            headers.set("X-NCP-APIGW-API-KEY", clientSecret);

            // ✅ 요청 파라미터 구성
            Map<String, String> params = new HashMap<>();
            params.put("source", "en");
            params.put("target", "ko");
            params.put("text", text);

            StringBuilder bodyBuilder = new StringBuilder();
            params.forEach((k, v) -> bodyBuilder.append(k).append("=").append(v).append("&"));
            String body = bodyBuilder.substring(0, bodyBuilder.length() - 1); // 마지막 & 제거

            HttpEntity<String> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                URI.create(apiUrl),
                HttpMethod.POST,
                requestEntity,
                String.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String result = extractTranslatedText(response.getBody());
                log.info("✅ Papago 번역 성공: {} → {}", text, result);
                return result;
            } else {
                log.error("Papago 번역 실패: {}", response.getStatusCode());
                return text;
            }

        } catch (Exception e) {
            log.error("Papago 번역 중 오류 발생: {}", e.getMessage());
            return text;
        }
    }

    private String extractTranslatedText(String responseBody) {
        try {
            int start = responseBody.indexOf("\"translatedText\":\"") + 18;
            int end = responseBody.indexOf("\"", start);
            if (start > 0 && end > start) {
                return responseBody.substring(start, end);
            }
        } catch (Exception e) {
            log.error("Papago 응답 파싱 실패: {}", e.getMessage());
        }
        return null;
    }
}
