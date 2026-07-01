package com.flowforge.controller;

import com.flowforge.dto.*;
import com.flowforge.entity.User;
import com.flowforge.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(
            @RequestBody AiChatRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(aiService.chat(user.getId(), req));
    }

    @PostMapping("/tasks-from-description")
    public ResponseEntity<AiChatResponse> tasksFromDescription(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        AiChatRequest req = new AiChatRequest(
            "Generate a task breakdown for: " + body.get("description"), null);
        return ResponseEntity.ok(aiService.chat(user.getId(), req));
    }

    @PostMapping("/summary")
    public ResponseEntity<AiChatResponse> summary(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        AiChatRequest req = new AiChatRequest(
            "Give me a project status summary for project: " + body.getOrDefault("projectId", "all"), null);
        return ResponseEntity.ok(aiService.chat(user.getId(), req));
    }

    @PostMapping("/simulate")
    public ResponseEntity<AiChatResponse> simulate(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        AiChatRequest req = new AiChatRequest(
            "Simulate what-if scenario: " + body.get("description"), null);
        return ResponseEntity.ok(aiService.chat(user.getId(), req));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<Map<String, Object>>> conversations(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(aiService.getConversations(user.getId()));
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<List<AiChatResponse>> conversationMessages(@PathVariable Long id) {
        return ResponseEntity.ok(aiService.getConversationMessages(id));
    }
}
