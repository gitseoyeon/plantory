package org.example.plantory_be.entity;

import lombok.Getter;

@Getter
public enum PotSize {
    XS("XS (너비 10cm 이하)"),
    S("S (너비 10 ~ 20cm)"),
    M("M (너비 20 ~ 50cm)"),
    L("L (너비 50 ~ 100cm)"),
    XL("XL (너비 100cm 이상)");

    private final String label;

    PotSize(String label) {
        this.label = label;
    }
}
