package com.flowforge.service;

import com.flowforge.dto.*;
import com.flowforge.entity.*;
import com.flowforge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final ProjectService projectService;

    public List<TaskDto> findByProject(Long projectId) {
        return taskRepository.findByProjectIdOrderBySortOrderAsc(projectId)
            .stream().map(this::toDto).toList();
    }

    public List<TaskDto> findByAssignee(Long userId) {
        return taskRepository.findByAssigneeIdOrderByDueDateAsc(userId)
            .stream().map(this::toDto).toList();
    }

    public TaskDto findById(Long id) {
        return taskRepository.findById(id).map(this::toDto)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));
    }

    @Transactional
    public TaskDto create(Long projectId, CreateTaskRequest req) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        User assignee = req.assigneeId() != null
            ? userRepository.findById(req.assigneeId()).orElse(null)
            : null;
        Task t = Task.builder()
            .project(project)
            .title(req.title())
            .description(req.description())
            .priority(req.priority() != null ? req.priority().toUpperCase() : "MEDIUM")
            .tag(req.tag())
            .assignee(assignee)
            .dueDate(req.dueDate())
            .build();
        t = taskRepository.save(t);
        projectService.updateProgress(projectId);
        return toDto(t);
    }

    @Transactional
    public TaskDto update(Long taskId, Map<String, Object> updates) {
        Task t = taskRepository.findById(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        if (updates.containsKey("title")) t.setTitle((String) updates.get("title"));
        if (updates.containsKey("description")) t.setDescription((String) updates.get("description"));
        if (updates.containsKey("status")) t.setStatus(((String) updates.get("status")).toUpperCase().replace(" ", "_"));
        if (updates.containsKey("priority")) t.setPriority(((String) updates.get("priority")).toUpperCase());
        if (updates.containsKey("tag")) t.setTag((String) updates.get("tag"));
        if (updates.containsKey("progress")) t.setProgress((Integer) updates.get("progress"));
        if (updates.containsKey("sortOrder")) t.setSortOrder((Integer) updates.get("sortOrder"));
        if (updates.containsKey("assigneeId")) {
            Object aId = updates.get("assigneeId");
            if (aId != null) {
                Long assigneeId = aId instanceof Number ? ((Number) aId).longValue() : Long.parseLong(aId.toString());
                t.setAssignee(userRepository.findById(assigneeId).orElse(null));
            } else {
                t.setAssignee(null);
            }
        }
        if (updates.containsKey("dueDate")) {
            String dateStr = (String) updates.get("dueDate");
            t.setDueDate(dateStr != null ? java.time.LocalDate.parse(dateStr) : null);
        }
        t = taskRepository.save(t);
        projectService.updateProgress(t.getProject().getId());
        return toDto(t);
    }

    @Transactional
    public TaskDto updateStatus(Long taskId, String status) {
        Task t = taskRepository.findById(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        t.setStatus(status.toUpperCase().replace(" ", "_"));
        if ("COMPLETED".equals(t.getStatus())) t.setProgress(100);
        t = taskRepository.save(t);
        projectService.updateProgress(t.getProject().getId());
        return toDto(t);
    }

    @Transactional
    public void delete(Long taskId) {
        Task t = taskRepository.findById(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        Long projectId = t.getProject().getId();
        taskRepository.delete(t);
        projectService.updateProgress(projectId);
    }

    // Comments
    public List<CommentDto> getComments(Long taskId) {
        return commentRepository.findByTaskIdOrderByCreatedAtAsc(taskId)
            .stream().map(c -> new CommentDto(c.getId(), c.getTask().getId(),
                c.getUser().getId(), c.getUser().getName(), c.getUser().getAvatarUrl(),
                c.getContent(), c.getCreatedAt())).toList();
    }

    @Transactional
    public CommentDto addComment(Long taskId, Long userId, String content) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Comment c = Comment.builder().task(task).user(user).content(content).build();
        c = commentRepository.save(c);
        return new CommentDto(c.getId(), taskId, userId, user.getName(), user.getAvatarUrl(),
            c.getContent(), c.getCreatedAt());
    }

    private TaskDto toDto(Task t) {
        long comments = commentRepository.countByTaskId(t.getId());
        return new TaskDto(t.getId(), t.getProject().getId(), t.getTitle(), t.getDescription(),
            t.getStatus(), t.getPriority(), t.getTag(),
            t.getAssignee() != null ? t.getAssignee().getId() : null,
            t.getDueDate(), t.getProgress(), t.getAiReview(), t.getSortOrder(),
            comments, t.getCreatedAt(), t.getUpdatedAt());
    }
}
