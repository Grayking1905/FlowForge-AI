package com.flowforge.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record CreateProjectRequest(
    @NotBlank String name,
    String description,
    LocalDate startDate, LocalDate endDate,
    String priority, String category, String clientName,
    String icon, String color, Boolean aiOptimized
) {}
