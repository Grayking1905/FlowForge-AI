package com.flowforge.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// --- Auth DTOs ---
public record LoginRequest(
    @NotBlank @Email String email,
    @NotBlank String password
) {}
