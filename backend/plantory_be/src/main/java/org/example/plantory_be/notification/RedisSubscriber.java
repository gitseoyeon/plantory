package org.example.plantory_be.notification;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisSubscriber implements MessageListener {
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try{
            String json = new String(message.getBody());
            NotificationMessage payload = objectMapper.readValue(json, NotificationMessage.class);
            messagingTemplate.convertAndSend("/topic/notifications/" + payload.getReceiverId(), payload);
            log.info("📬 Redis 메시지 수신: {}, receiverId: {}", payload.getContent(), payload.getReceiverId());
        } catch (Exception e) {
            log.error("RedisSubscriber error: {}", e.getMessage(), e);
        }
    }
}
