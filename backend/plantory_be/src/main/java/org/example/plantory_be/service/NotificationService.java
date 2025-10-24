package org.example.plantory_be.service;

import lombok.RequiredArgsConstructor;
import org.example.plantory_be.dto.response.NotificationResponse;
import org.example.plantory_be.entity.Notification;
import org.example.plantory_be.entity.User;
import org.example.plantory_be.repository.NotificationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final AuthenticationService authenticationService;

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getNotifications(Pageable pageable) {
        Long currentId = authenticationService.getCurrentUser().getId();
        return notificationRepository.findByReceiverIdOrderByCreatedAtDesc(currentId, pageable)
                .map(NotificationResponse::fromEntity);
    }

    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("알림을 찾을 수 없습니다."));
        notification.setRead(true);
    }

    public void markAllAsRead() {
        Long currentId = authenticationService.getCurrentUser().getId();
        List<Notification> notifications = notificationRepository.findAllByReceiverId(currentId);
        notifications.forEach(n -> n.setRead(true));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Notification saveNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void removeNotification(Long id) {
        authenticationService.getCurrentUser();
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 알림입니다."));
        notificationRepository.delete(notification);
    }

    public void removeAllNotification() {
        User user = authenticationService.getCurrentUser();
        notificationRepository.deleteAllByReceiverId(user.getId());
    }
}
