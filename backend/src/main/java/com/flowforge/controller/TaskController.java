package com.flowforge.controller;

import com.flowforge.dto.*;
import com.flowforge.entity.User;
import com.flowforge.service.TaskService;
import com.flowforge.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final NotificationService notificationService;

    @GetMapping("/api/projects/{projectId}/tasks")
    public ResponseEntity<List<TaskDto>> listByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(taskService.findByProject(projectId));
    }

    @PostMapping("/api/projects/{projectId}/tasks")
    public ResponseEntity<TaskDto> create(
            @PathVariable Long projectId,
            @Valid @RequestBody CreateTaskRequest req,
            @AuthenticationPrincipal User user) {
        TaskDto task = taskService.create(projectId, req);
        // Notify assignee
        if (req.assigneeId() != null && !req.assigneeId().equals(user.getId())) {
            notificationService.create(req.assigneeId(),
                user.getName() + " assigned you to \"" + req.title() + "\"", "TASK");
        }
        return ResponseEntity.ok(task);
    }

    @GetMapping("/api/tasks/{taskId}")
    public ResponseEntity<TaskDto> get(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.findById(taskId));
    }

    @PutMapping("/api/tasks/{taskId}")
    public ResponseEntity<TaskDto> update(
            @PathVariable Long taskId,
            @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(taskService.update(taskId, updates));
    }

    @PutMapping("/api/tasks/{taskId}/status")
    public ResponseEntity<TaskDto> updateStatus(
            @PathVariable Long taskId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(taskService.updateStatus(taskId, body.get("status")));
    }

    @DeleteMapping("/api/tasks/{taskId}")
    public ResponseEntity<Void> delete(@PathVariable Long taskId) {
        taskService.delete(taskId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/tasks/{taskId}/comments")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.getComments(taskId));
    }

    @PostMapping("/api/tasks/{taskId}/comments")
    public ResponseEntity<CommentDto> addComment(
            @PathVariable Long taskId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.addComment(taskId, user.getId(), body.get("content")));
    }
}
