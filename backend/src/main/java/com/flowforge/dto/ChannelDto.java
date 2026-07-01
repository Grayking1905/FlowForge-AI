package com.flowforge.dto;

import java.time.Instant;
import java.util.List;

public record ChannelDto(
    Long id, String name, String type, String topic, Integer unread, Instant createdAt
) {}
