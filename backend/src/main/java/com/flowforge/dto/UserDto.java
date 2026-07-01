package com.flowforge.dto;

import java.time.Instant;

public record UserDto(
    Long id, String name, String email, String role,
    String avatarUrl, String status, Instant createdAt
) {}
