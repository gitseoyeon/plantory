package org.example.plantory_be.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.plantory_be.entity.Notification;
import org.example.plantory_be.service.NotificationService;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {
    private final RedisPublisher redisPublisher;
    private final NotificationService notificationService;

    @Async
    @EventListener
    public void handleNotification(NotificationEvent event) {
        Notification notification = Notification.builder()
                .receiverId(event.getReceiverId())
                .type(event.getType())
                .content(event.getContent())
                .targetId(event.getTargetId())
                .actorId(event.getActorId())
                .actorName(event.getActorName())
                .build();
        notificationService.saveNotification(notification);

        NotificationMessage msg = NotificationMessage.builder()
                .receiverId(event.getReceiverId())
                .type(event.getType())
                .content(event.getContent())
                .targetId(event.getTargetId())
                .actorId(event.getActorId())
                .actorName(event.getActorName())
                .createdAt(OffsetDateTime.now().toString())
                .build();

        log.info("📤 Redis 발행 시도: {}", msg);
        redisPublisher.publish(msg);
    }
}
