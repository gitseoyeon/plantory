package org.example.plantory_be.repository;

import org.example.plantory_be.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByReceiverIdOrderByCreatedAtDesc(Long receiverId, Pageable pageable);
    List<Notification> findAllByReceiverId(Long receiverId);

    void deleteAllByReceiverId(Long receiverId);
}
