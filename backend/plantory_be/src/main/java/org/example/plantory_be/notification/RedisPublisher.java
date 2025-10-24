package org.example.plantory_be.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RedisPublisher {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ChannelTopic notificationTopic;

    public void publish(NotificationMessage message) {
        log.info("📡 Redis publish: {}", message);
        redisTemplate.convertAndSend(notificationTopic.getTopic(), message);
    }
}
