package com.flowforge.service;

import com.flowforge.dto.NotificationDto;
import com.flowforge.entity.*;
import com.flowforge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public List<NotificationDto> findByUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream().map(this::toDto).toList();
    }

    @Transactional
    public NotificationDto create(Long userId, String message, String type) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Notification n = Notification.builder()
            .user(user).message(message).type(type).build();
        n = notificationRepository.save(n);
        NotificationDto dto = toDto(n);
        // Push real-time via WebSocket
        messagingTemplate.convertAndSend("/queue/notifications." + userId, dto);
        return dto;
    }

    @Transactional
    public void markRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllRead(Long userId) {
        notificationRepository.markAllReadByUserId(userId);
    }

    public long unreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    private NotificationDto toDto(Notification n) {
        return new NotificationDto(n.getId(), n.getMessage(), n.getType(), n.getIsRead(), n.getCreatedAt());
    }
}
