package org.example.plantory_be.controller;

import lombok.RequiredArgsConstructor;
import org.example.plantory_be.service.UserPlantService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/plant")
@RequiredArgsConstructor
public class UserPlantDiaryController {
    private final UserPlantService userPlantService;


}
