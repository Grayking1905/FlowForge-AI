package com.flowforge.service;

import com.flowforge.dto.*;
import com.flowforge.entity.*;
import com.flowforge.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final ChannelRepository channelRepository;
    private final MessageRepository messageRepository;
    private final MessageReactionRepository reactionRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    public List<ChannelDto> getChannelsForUser(Long userId) {
        return channelRepository.findByMemberId(userId).stream()
            .map(c -> new ChannelDto(c.getId(), c.getName(), c.getType(), c.getTopic(), 0, c.getCreatedAt()))
            .toList();
    }

    public List<MessageDto> getMessages(Long channelId, Long currentUserId) {
        List<Message> messages = messageRepository.findByChannelIdOrderByCreatedAtAsc(channelId);
        return messages.stream().map(m -> toDto(m, currentUserId)).toList();
    }

    @Transactional
    public MessageDto sendMessage(Long channelId, Long userId, String content) {
        Channel channel = channelRepository.findById(channelId)
            .orElseThrow(() -> new IllegalArgumentException("Channel not found"));
        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;

        Message msg = Message.builder()
            .channel(channel)
            .user(user)
            .content(content)
            .type("USER")
            .build();
        msg = messageRepository.save(msg);

        MessageDto dto = toDto(msg, userId);
        // Broadcast via WebSocket to all channel subscribers
        messagingTemplate.convertAndSend("/topic/channel." + channelId, dto);
        return dto;
    }

    @Transactional
    public MessageDto toggleReaction(Long messageId, Long userId, String emoji) {
        Optional<MessageReaction> existing = reactionRepository
            .findByMessageIdAndUserIdAndEmoji(messageId, userId, emoji);
        Message msg = messageRepository.findById(messageId)
            .orElseThrow(() -> new IllegalArgumentException("Message not found"));

        if (existing.isPresent()) {
            reactionRepository.delete(existing.get());
        } else {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
            reactionRepository.save(MessageReaction.builder()
                .message(msg).user(user).emoji(emoji).build());
        }

        MessageDto dto = toDto(msg, userId);
        messagingTemplate.convertAndSend("/topic/channel." + msg.getChannel().getId(), dto);
        return dto;
    }

    @Transactional
    public ChannelDto createChannel(String name, String type, Long userId) {
        Channel ch = Channel.builder().name(name).type(type != null ? type : "CHANNEL").build();
        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) ch.getMembers().add(user);
        }
        ch = channelRepository.save(ch);
        return new ChannelDto(ch.getId(), ch.getName(), ch.getType(), ch.getTopic(), 0, ch.getCreatedAt());
    }

    private MessageDto toDto(Message m, Long currentUserId) {
        // Get reactions grouped by emoji
        List<Object[]> reactionCounts = reactionRepository.countByMessageGroupByEmoji(m.getId());
        List<ReactionDto> reactions = reactionCounts.stream()
            .map(r -> new ReactionDto((String) r[0], (Long) r[1]))
            .toList();

        // Parse embed JSON
        Map<String, Object> embed = null;
        if (m.getEmbedJson() != null) {
            try {
                embed = objectMapper.readValue(m.getEmbedJson(), new TypeReference<>() {});
            } catch (Exception ignored) {}
        }

        boolean isSystem = "SYSTEM".equals(m.getType());
        boolean isCurrentUser = m.getUser() != null && m.getUser().getId().equals(currentUserId);

        return new MessageDto(
            m.getId(), m.getChannel().getId(),
            m.getUser() != null ? m.getUser().getId() : null,
            m.getUser() != null ? m.getUser().getName() : null,
            m.getUser() != null ? m.getUser().getAvatarUrl() : null,
            m.getContent(), m.getType(), embed,
            reactions, 0,
            isCurrentUser, isSystem,
            m.getCreatedAt()
        );
    }
}
