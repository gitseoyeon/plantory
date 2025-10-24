package org.example.plantory_be.notification;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationMessage {
    private Long receiverId;
    private String type;
    private String content;
    private Long targetId;
    private Long actorId;
    private String actorName;
    private String createdAt;
}
