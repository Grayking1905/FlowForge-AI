package com.flowforge.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record CreateTaskRequest(
    @NotBlank String title,
    String description,
    String priority, String tag,
    Long assigneeId, LocalDate dueDate
) {}
