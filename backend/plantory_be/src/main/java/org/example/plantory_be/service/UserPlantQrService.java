package org.example.plantory_be.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.plantory_be.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.EnumMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserPlantQrService {
    private final AuthenticationService authenticationService;

    @Value("${app.upload.dir.qr}")
    private String qrUploadDir;

    @Value("${BACKEND_URL}")
    private String baseUrl; //프런트에서 큐알이미지 보여줄 주소

/**
 * QR 코드 생성
 * - uploads/qr/{userId}/qr_YYYYMMDDHHmmss_UUID6자.png 형식으로 저장
 * - 외부 접근 URL 반환
 */
public QRResult generateQrForPlant(Long plantId) {
    try {
        User currentUser = authenticationService.getCurrentUser();
        if (currentUser == null) {
            throw new IllegalStateException("로그인된 사용자 정보가 없습니다.");
        }

        // QR 코드에 담을 내용 : 유저 식물 상세보기 주소
        String content = baseUrl + "/plant/" + plantId;

        // 사용자별 디렉토리 생성
        Path userDir = Paths.get(qrUploadDir, String.valueOf(currentUser.getId()));
        Files.createDirectories(userDir);

        String timestamp = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String fileName = plantId + "_" + timestamp + "_" + UUID.randomUUID().toString().substring(0, 6) + ".png";
        Path outPath = userDir.resolve(fileName);

        // QR 생성 옵션
        int size = 300; // 픽셀단위 (가로/세로)
        Map<EncodeHintType, Object> hints = new EnumMap<>(EncodeHintType.class);
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M);
        hints.put(EncodeHintType.MARGIN, 1);

        BitMatrix matrix = new MultiFormatWriter()
                .encode(content, BarcodeFormat.QR_CODE, size, size, hints);

        MatrixToImageWriter.writeToPath(matrix, "PNG", outPath);

        // 공개 접근 URL 구성
        String publicUrl = String.format("%s/files/%d/%s", baseUrl, currentUser.getId(), fileName);

        return new QRResult(content, publicUrl, outPath);

    } catch (Exception e) {

        throw new RuntimeException("QR 코드 생성 실패: " + e.getMessage(), e);
    }
}

public record QRResult(String qrContent, String qrImageUrl, Path localPath) {}
}
