package com.flowforge.dto;

import java.time.Instant;

public record CommentDto(
    Long id, Long taskId, Long userId, String userName, String userAvatar,
    String content, Instant createdAt
) {}
