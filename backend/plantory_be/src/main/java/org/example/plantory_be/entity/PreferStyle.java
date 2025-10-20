package org.example.plantory_be.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum PreferStyle {
    MINIMAL("심플하고 깔끔한 스타일"),
    TROPICAL("열대식물 중심의 풍성한 스타일"),
    RUSTIC("자연스럽고 소박한 스타일"),
    MODERN("세련되고 도시적인 스타일"),
    NATURAL("자연친화적이고 편안한 스타일");

    private final String description;
}
