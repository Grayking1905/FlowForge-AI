package com.flowforge.websocket;

import com.flowforge.dto.MessageDto;
import com.flowforge.entity.User;
import com.flowforge.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final MessageService messageService;

    /**
     * Handle messages sent to /app/chat.send
     * Broadcasts to /topic/channel.{channelId}
     */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload Map<String, Object> payload, Principal principal) {
        Long channelId = ((Number) payload.get("channelId")).longValue();
        String content = (String) payload.get("content");

        // Get user ID from principal
        Long userId = null;
        if (principal instanceof Authentication auth && auth.getPrincipal() instanceof User user) {
            userId = user.getId();
        } else if (payload.containsKey("userId")) {
            userId = ((Number) payload.get("userId")).longValue();
        }

        if (userId != null && content != null && !content.isBlank()) {
            messageService.sendMessage(channelId, userId, content);
        }
    }

    /**
     * Handle typing indicators: /app/chat.typing
     * Broadcasts to /topic/channel.{channelId}.typing
     */
    @MessageMapping("/chat.typing")
    @SendTo("/topic/channel.{channelId}.typing")
    public Map<String, Object> typing(@Payload Map<String, Object> payload) {
        return Map.of(
            "userId", payload.get("userId"),
            "userName", payload.getOrDefault("userName", "Someone"),
            "channelId", payload.get("channelId"),
            "typing", payload.getOrDefault("typing", true)
        );
    }
}
