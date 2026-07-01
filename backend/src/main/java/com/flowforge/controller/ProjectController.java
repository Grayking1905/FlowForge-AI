package com.flowforge.controller;

import com.flowforge.dto.*;
import com.flowforge.entity.User;
import com.flowforge.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectDto>> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(projectService.findAll(category, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ProjectDto> create(
            @Valid @RequestBody CreateProjectRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.create(req, user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDto> update(
            @PathVariable Long id,
            @RequestBody CreateProjectRequest req) {
        return ResponseEntity.ok(projectService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<ProjectDto> addMember(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(projectService.addMember(id, body.get("userId")));
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<ProjectDto> removeMember(
            @PathVariable Long id, @PathVariable Long userId) {
        return ResponseEntity.ok(projectService.removeMember(id, userId));
    }
}
