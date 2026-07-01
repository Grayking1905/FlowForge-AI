package com.flowforge.dto;

import java.time.Instant;
import java.util.Map;

public record AiChatResponse(
    Long conversationId, String role, String content,
    Map<String, Object> metadata, Instant createdAt
) {}
