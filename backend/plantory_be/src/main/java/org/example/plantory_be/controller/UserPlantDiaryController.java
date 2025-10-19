package org.example.plantory_be.controller;

import lombok.RequiredArgsConstructor;
import org.example.plantory_be.service.QRCodeService;
import org.example.plantory_be.service.UserPlantService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/plant")
@RequiredArgsConstructor
public class UserPlantDiaryController {
    private final UserPlantService userPlantService;
    private final QRCodeService qrCodeService;

    /* 작업중
    @PostMapping("/{plantId}/qr")
    public ResponseEntity<Map<String, String>> generatePlantQr(@PathVariable Long plantId) {
        Map<String, String> res = userPlantService.generateQrForPlant(plantId);
        return ResponseEntity.ok(res);
    }
    */
}
