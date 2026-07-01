package com.flowforge.controller;

import com.flowforge.dto.*;
import com.flowforge.entity.User;
import com.flowforge.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/channels")
@RequiredArgsConstructor
public class ChannelController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<List<ChannelDto>> list(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(messageService.getChannelsForUser(user.getId()));
    }

    @PostMapping
    public ResponseEntity<ChannelDto> create(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(messageService.createChannel(
            body.get("name"), body.getOrDefault("type", "CHANNEL"), user.getId()));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<MessageDto>> getMessages(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(messageService.getMessages(id, user.getId()));
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<MessageDto> sendMessage(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(messageService.sendMessage(id, user.getId(), body.get("content")));
    }

    @PostMapping("/messages/{messageId}/reactions")
    public ResponseEntity<MessageDto> toggleReaction(
            @PathVariable Long messageId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(messageService.toggleReaction(messageId, user.getId(), body.get("emoji")));
    }
}
