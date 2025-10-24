package org.example.plantory_be.notification;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NotificationEvent {
    private Long receiverId;
    private String type;
    private String content;
    private Long targetId;
    private Long actorId;
    private String actorName;
}
