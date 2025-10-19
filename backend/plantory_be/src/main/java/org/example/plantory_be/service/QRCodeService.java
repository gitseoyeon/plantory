package org.example.plantory_be.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.EnumMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QRCodeService {

    @Value("${app.upload.dir.qr}")
    private String qrUploadDir;

    @Value("${app.public.base-url}")
    private String baseUrl;

    /**
     * content: QR에 담을 URL 또는 텍스트
     * fileHint: 파일명 힌트(없으면 UUID로 생성)
     */
    public QRResult generate(String content, String fileHint, int size) {
        try {
            // 1) 디렉토리 보장
            Path uploadDir = Paths.get(qrUploadDir);
            Files.createDirectories(uploadDir);

            // 2) 파일명
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            String safeHint = (fileHint == null || fileHint.isBlank()) ? "qr" : fileHint.replaceAll("[^a-zA-Z0-9-_]", "_");
            String fileName = safeHint + "_" + timestamp + "_" + UUID.randomUUID().toString().substring(0, 8) + ".png";
            Path outPath = uploadDir.resolve(fileName);

            // 3) ZXing 옵션
            Map<EncodeHintType, Object> hints = new EnumMap<>(EncodeHintType.class);
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M); // L/M/Q/H
            hints.put(EncodeHintType.MARGIN, 1);

            // 4) QR 생성
            BitMatrix matrix = new MultiFormatWriter()
                    .encode(content, BarcodeFormat.QR_CODE, size, size, hints);

            // 5) PNG 저장
            MatrixToImageWriter.writeToPath(matrix, "PNG", outPath);

            // 6) 공개 접근 URL 구성 (WebConfig: /files/** -> file:qrUploadDir 매핑)
            String publicPngUrl = baseUrl + "/files/" + fileName;

            return new QRResult(content, publicPngUrl, outPath);
        } catch (Exception e) {
            throw new RuntimeException("QR 코드 생성 실패: " + e.getMessage(), e);
        }
    }

    public static class QRResult {
        public final String qrUrl;       // QR에 인코딩된 원본 URL(스캔해서 열릴 URL)
        public final String qrImageUrl;  // 생성된 PNG의 공개 접근 URL (/files/..)
        public final Path localPath;     // 서버 로컬 저장 경로

        public QRResult(String qrUrl, String qrImageUrl, Path localPath) {
            this.qrUrl = qrUrl;
            this.qrImageUrl = qrImageUrl;
            this.localPath = localPath;
        }
    }
}
