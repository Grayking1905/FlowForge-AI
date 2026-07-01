package com.flowforge.dto;

import java.time.Instant;

public record NotificationDto(
    Long id, String message, String type, Boolean read, Instant createdAt
) {}
