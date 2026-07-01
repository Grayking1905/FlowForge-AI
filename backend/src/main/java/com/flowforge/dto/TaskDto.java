package com.flowforge.dto;

import java.time.Instant;
import java.time.LocalDate;

public record TaskDto(
    Long id, Long projectId, String title, String description,
    String status, String priority, String tag,
    Long assigneeId, LocalDate dueDate,
    Integer progress, Boolean aiReview, Integer sortOrder,
    Long commentsCount,
    Instant createdAt, Instant updatedAt
) {}
