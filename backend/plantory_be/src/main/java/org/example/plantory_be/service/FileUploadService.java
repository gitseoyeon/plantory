package org.example.plantory_be.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
public class FileUploadService {
    @Value("${app.upload.image}")
    private String uploadPath;

    public String uploadProfileImage(MultipartFile file) {
        if(file.isEmpty()) {
            throw new IllegalArgumentException("빈 파일은 업로드 할 수 없습니다.");
        }

        try {
            Path uploadDir = Paths.get(uploadPath, "profile");
            if(!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if(originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String newFilename = UUID.randomUUID() + "_" + originalFilename;
            Path filePath = uploadDir.resolve(newFilename);

            file.transferTo(filePath.toFile());
            log.info("파일 업로드 성공: {}", filePath);
            return "/uploads/profile/" + newFilename;
        } catch (IOException e) {
            log.error("파일 업로드 실패: {}", e.getMessage(), e);
            throw new RuntimeException("파일 업로드 중 오류 발생");
        }
    }
}
