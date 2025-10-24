package org.example.plantory_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PlantIdentificationResponse {
    private String plantName;
    private String confidence;
    private String imageUrl;
}
