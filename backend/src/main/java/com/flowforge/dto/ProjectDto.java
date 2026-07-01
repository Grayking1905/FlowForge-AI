package com.flowforge.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record ProjectDto(
    Long id, String name, String description, Long ownerId,
    LocalDate startDate, LocalDate endDate,
    String status, String priority, String category,
    String clientName, String icon, String color,
    Integer progress, Boolean aiOptimized,
    List<Long> teamIds, Long tasksCount, Long completedTasks,
    Instant createdAt, Instant updatedAt
) {}
