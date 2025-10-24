package org.example.plantory_be.dto.response;

import lombok.*;
import org.example.plantory_be.entity.Notification;

import java.time.format.DateTimeFormatter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String content;
    private String type;
    private Long targetId;
    private boolean read;
    private String createdAt;

    public static NotificationResponse fromEntity(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .content(notification.getContent())
                .type(notification.getType())
                .targetId(notification.getTargetId())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .build();
    }
}
