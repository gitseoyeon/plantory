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
public class UserPlantImageService {

    private final AuthenticationService authenticationService;

    @Value("${app.upload.dir.qr}")
    private String qrUploadDir;     // Uploads/qr/유저Id/timestamp_랜덤6자 - 유저식물 등록의 초기 사진, qr폴더에 저장

    public UploadResult saveOne(MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("업로드할 파일이 없습니다.");
            }

            var user = authenticationService.getCurrentUser();
            Long userId = user.getId();

            Path baseDir = Paths.get(qrUploadDir).toAbsolutePath().normalize();

            Path targetDir = baseDir.resolve(String.valueOf(userId));
            Files.createDirectories(targetDir);

            String timestamp = LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String original = file.getOriginalFilename();
            String ext = (original != null && original.contains(".")) ? original.substring(original.lastIndexOf('.')) : "";
            String filename = timestamp + "_" + UUID.randomUUID().toString().substring(0, 10) + ext;
            Path out = targetDir.resolve(filename);

            // 저장
            Files.copy(file.getInputStream(), out, StandardCopyOption.REPLACE_EXISTING);

            // 공개 URL: /files/qr/{userId}/{filename}
            String publicUrl = String.format("/files/qr/%d/%s", userId, filename);

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

