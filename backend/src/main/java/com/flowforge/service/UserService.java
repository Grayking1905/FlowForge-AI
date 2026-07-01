package com.flowforge.service;

import com.flowforge.dto.*;
import com.flowforge.entity.User;
import com.flowforge.repository.UserRepository;
import com.flowforge.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email already exists");
        }
        User user = User.builder()
            .name(req.name())
            .email(req.email())
            .passwordHash(passwordEncoder.encode(req.password()))
            .role("DEVELOPER")
            .status("ONLINE")
            .build();
        user = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(token, toDto(user));
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
            .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        user.setStatus("ONLINE");
        userRepository.save(user);
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(token, toDto(user));
    }

    public List<UserDto> findAll() {
        return userRepository.findAll().stream().map(this::toDto).toList();
    }

    public UserDto findById(Long id) {
        return userRepository.findById(id).map(this::toDto)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public UserDto updateUser(Long id, UserDto dto) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (dto.name() != null) user.setName(dto.name());
        if (dto.avatarUrl() != null) user.setAvatarUrl(dto.avatarUrl());
        if (dto.status() != null) user.setStatus(dto.status());
        return toDto(userRepository.save(user));
    }

    public UserDto toDto(User u) {
        return new UserDto(u.getId(), u.getName(), u.getEmail(), u.getRole(),
            u.getAvatarUrl(), u.getStatus(), u.getCreatedAt());
    }
}
