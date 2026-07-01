package com.flowforge.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record MessageDto(
    Long id, Long channelId, Long userId, String userName, String userAvatar,
    String content, String type, Map<String, Object> embed,
    List<ReactionDto> reactions, Integer threadCount,
    Boolean isCurrentUser, Boolean isSystem,
    Instant createdAt
) {}
