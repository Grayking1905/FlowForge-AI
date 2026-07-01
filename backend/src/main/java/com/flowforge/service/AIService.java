package com.flowforge.service;

import com.flowforge.dto.*;
import com.flowforge.entity.*;
import com.flowforge.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AIService {

    private final AiConversationRepository conversationRepo;
    private final AiMessageRepository messageRepo;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public AiChatResponse chat(Long userId, AiChatRequest req) {
        AiConversation conv;
        if (req.conversationId() != null) {
            conv = conversationRepo.findById(req.conversationId())
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));
        } else {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
            conv = AiConversation.builder().user(user)
                .title(req.message().length() > 50 ? req.message().substring(0, 50) + "..." : req.message())
                .build();
            conv = conversationRepo.save(conv);
        }

        // Save user message
        AiMessage userMsg = AiMessage.builder()
            .conversation(conv).role("USER").content(req.message()).build();
        messageRepo.save(userMsg);

        // Generate AI response (mock LLM)
        Map<String, Object> response = generateMockResponse(req.message());
        String content = (String) response.get("content");
        response.remove("content");

        String metadataJson = null;
        if (!response.isEmpty()) {
            try { metadataJson = objectMapper.writeValueAsString(response); } catch (Exception ignored) {}
        }

        AiMessage aiMsg = AiMessage.builder()
            .conversation(conv).role("ASSISTANT").content(content)
            .metadataJson(metadataJson).build();
        aiMsg = messageRepo.save(aiMsg);

        Map<String, Object> metadata = null;
        if (metadataJson != null) {
            try { metadata = objectMapper.readValue(metadataJson, new TypeReference<>() {}); } catch (Exception ignored) {}
        }

        return new AiChatResponse(conv.getId(), "ASSISTANT", content, metadata, aiMsg.getCreatedAt());
    }

    public List<Map<String, Object>> getConversations(Long userId) {
        return conversationRepo.findByUserIdOrderByCreatedAtDesc(userId).stream()
            .map(c -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("id", c.getId());
                m.put("title", c.getTitle());
                m.put("createdAt", c.getCreatedAt());
                return m;
            }).toList();
    }

    public List<AiChatResponse> getConversationMessages(Long convId) {
        return messageRepo.findByConversationIdOrderByCreatedAtAsc(convId).stream()
            .map(m -> {
                Map<String, Object> metadata = null;
                if (m.getMetadataJson() != null) {
                    try { metadata = objectMapper.readValue(m.getMetadataJson(), new TypeReference<>() {}); } catch (Exception ignored) {}
                }
                return new AiChatResponse(convId, m.getRole(), m.getContent(), metadata, m.getCreatedAt());
            }).toList();
    }

    // --- Mock LLM Engine ---
    private Map<String, Object> generateMockResponse(String message) {
        String lower = message.toLowerCase();
        Map<String, Object> response = new LinkedHashMap<>();

        if (lower.contains("roadmap") || lower.contains("plan") || lower.contains("timeline")) {
            response.put("content", "I've analyzed the parameters and generated a structured roadmap for your project.");
            response.put("roadmap", List.of(
                Map.of("phase", "Phase 1 (Weeks 1-2)", "description", "Requirements gathering, stakeholder alignment, and initial architecture design.", "done", true),
                Map.of("phase", "Phase 2 (Weeks 3-5)", "description", "Core feature development, API integration, and database schema finalization.", "done", true),
                Map.of("phase", "Phase 3 (Weeks 6-8)", "description", "UI/UX refinement, testing suite development, and performance optimization.", "done", false),
                Map.of("phase", "Phase 4 (Weeks 9-10)", "description", "Security audit, deployment pipeline setup, and launch preparation.", "done", false)
            ));
            response.put("bottlenecks", List.of(
                Map.of("title", "API Dependencies", "description", "External service integrations may introduce latency bottlenecks during Phase 2.", "severity", "error"),
                Map.of("title", "Design Review", "description", "Cross-team design approval typically adds 3-5 days to delivery timeline.", "severity", "tertiary")
            ));
        } else if (lower.contains("task") || lower.contains("generate") || lower.contains("create") || lower.contains("breakdown")) {
            response.put("content", "Based on your project description, I've generated a task breakdown following industry best practices.");
            response.put("generatedTasks", List.of(
                Map.of("title", "Set up project repository and CI/CD pipeline", "priority", "High", "tag", "DevOps"),
                Map.of("title", "Design database schema and entity relationships", "priority", "High", "tag", "Backend"),
                Map.of("title", "Implement user authentication with JWT", "priority", "High", "tag", "Backend"),
                Map.of("title", "Create responsive dashboard layout", "priority", "Medium", "tag", "Frontend"),
                Map.of("title", "Build REST API endpoints for core CRUD", "priority", "High", "tag", "Backend"),
                Map.of("title", "Implement real-time notifications with WebSocket", "priority", "Medium", "tag", "Frontend"),
                Map.of("title", "Write unit and integration test suites", "priority", "Medium", "tag", "QA"),
                Map.of("title", "Security review and penetration testing", "priority", "High", "tag", "Security")
            ));
        } else if (lower.contains("summary") || lower.contains("status") || lower.contains("progress") || lower.contains("report")) {
            response.put("content", "Here's your project status summary based on current data.");
            response.put("metrics", Map.of(
                "velocity", "+12% compared to last sprint",
                "health", "Excellent",
                "blockers", 0,
                "onTrack", "94% of tasks on schedule"
            ));
        } else if (lower.contains("simulate") || lower.contains("what if") || lower.contains("estimate") || lower.contains("forecast")) {
            response.put("content", "Based on current team velocity and scope analysis, here are the timeline projections.");
            response.put("scenarios", List.of(
                Map.of("name", "Optimistic", "weeks", 8, "confidence", "75%"),
                Map.of("name", "Most Likely", "weeks", 10, "confidence", "90%"),
                Map.of("name", "Pessimistic", "weeks", 14, "confidence", "95%")
            ));
        } else {
            response.put("content", "I've analyzed your request based on the current project context. I can help you generate project roadmaps, create task breakdowns, summarize project status, or run what-if simulations. Just ask!");
        }

        return response;
    }
}
