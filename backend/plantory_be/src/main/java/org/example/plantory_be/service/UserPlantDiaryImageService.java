package org.example.plantory_be.service;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserPlantDiaryImageService {

    private final AuthenticationService authenticationService;

    @Value("${app.upload.dir.plant}")
    private String plantUploadDir; // uploads/plant - 성장 사진


    public UploadResult saveOne(Long plantId, MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("업로드할 파일이 없습니다.");
            }

            var user = authenticationService.getCurrentUser();
            Long userId = user.getId();

            Path baseDir = Paths.get(plantUploadDir).toAbsolutePath().normalize();

            Path targetDir = baseDir.resolve(String.valueOf(userId)).resolve(String.valueOf(plantId));
            Files.createDirectories(targetDir);

            String timestamp = LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String original = file.getOriginalFilename();
            String ext = (original != null && original.contains(".")) ? original.substring(original.lastIndexOf('.')) : "";
            String filename = "dr_" + timestamp + "_" + UUID.randomUUID().toString().substring(0, 6) + ext;
            Path out = targetDir.resolve(filename);

            // 저장
            Files.copy(file.getInputStream(), out, StandardCopyOption.REPLACE_EXISTING);

            // 공개 URL: /files/plant/{userId}/{plantId}/{filename}
            String publicUrl = String.format("/files/plant/%d/%d/%s", userId, plantId, filename);

            return new UploadResult(filename, publicUrl);

        } catch (Exception e) {
            log.error("이미지 업로드 실패: {}", e.getMessage(), e);
            throw new RuntimeException("이미지 업로드 실패", e);
        }
    }

    @Getter
    @AllArgsConstructor
    public static class UploadResult {
        private String fileName;
        private String imageUrl; // 공개 URL
    }
}

