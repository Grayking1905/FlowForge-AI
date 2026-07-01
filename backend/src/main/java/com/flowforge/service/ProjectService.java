package com.flowforge.service;

import com.flowforge.dto.*;
import com.flowforge.entity.*;
import com.flowforge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    @Transactional(readOnly = true)
    public List<ProjectDto> findAll(String category, String status) {
        List<Project> projects;
        if (category != null && !category.equalsIgnoreCase("All")) {
            projects = projectRepository.findByCategory(category.toUpperCase());
        } else if (status != null) {
            projects = projectRepository.findByStatus(status.toUpperCase());
        } else {
            projects = projectRepository.findAll();
        }
        return projects.stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public ProjectDto findById(Long id) {
        return projectRepository.findById(id).map(this::toDto)
            .orElseThrow(() -> new IllegalArgumentException("Project not found"));
    }

    @Transactional
    public ProjectDto create(CreateProjectRequest req, Long ownerId) {
        User owner = userRepository.findById(ownerId)
            .orElseThrow(() -> new IllegalArgumentException("Owner not found"));
        Project p = Project.builder()
            .name(req.name())
            .description(req.description())
            .owner(owner)
            .startDate(req.startDate())
            .endDate(req.endDate())
            .priority(req.priority() != null ? req.priority().toUpperCase() : "MEDIUM")
            .category(req.category() != null ? req.category().toUpperCase() : "INTERNAL")
            .clientName(req.clientName())
            .icon(req.icon() != null ? req.icon() : "folder_open")
            .color(req.color() != null ? req.color() : "primary")
            .aiOptimized(req.aiOptimized() != null ? req.aiOptimized() : false)
            .build();
        p.getMembers().add(owner);
        p = projectRepository.save(p);
        return toDto(p);
    }

    @Transactional
    public ProjectDto update(Long id, CreateProjectRequest req) {
        Project p = projectRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        if (req.name() != null) p.setName(req.name());
        if (req.description() != null) p.setDescription(req.description());
        if (req.startDate() != null) p.setStartDate(req.startDate());
        if (req.endDate() != null) p.setEndDate(req.endDate());
        if (req.priority() != null) p.setPriority(req.priority().toUpperCase());
        if (req.category() != null) p.setCategory(req.category().toUpperCase());
        if (req.clientName() != null) p.setClientName(req.clientName());
        if (req.icon() != null) p.setIcon(req.icon());
        if (req.color() != null) p.setColor(req.color());
        if (req.aiOptimized() != null) p.setAiOptimized(req.aiOptimized());
        return toDto(projectRepository.save(p));
    }

    @Transactional
    public void delete(Long id) {
        projectRepository.deleteById(id);
    }

    @Transactional
    public ProjectDto addMember(Long projectId, Long userId) {
        Project p = projectRepository.findById(projectId)
            .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        User u = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        p.getMembers().add(u);
        return toDto(projectRepository.save(p));
    }

    @Transactional
    public ProjectDto removeMember(Long projectId, Long userId) {
        Project p = projectRepository.findById(projectId)
            .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        p.getMembers().removeIf(u -> u.getId().equals(userId));
        return toDto(projectRepository.save(p));
    }

    @Transactional
    public void updateProgress(Long projectId) {
        long total = taskRepository.countByProjectId(projectId);
        long completed = taskRepository.countCompletedByProjectId(projectId);
        int progress = total > 0 ? (int) ((completed * 100) / total) : 0;
        projectRepository.findById(projectId).ifPresent(p -> {
            p.setProgress(progress);
            projectRepository.save(p);
        });
    }

    private ProjectDto toDto(Project p) {
        long taskCount = taskRepository.countByProjectId(p.getId());
        long completedCount = taskRepository.countCompletedByProjectId(p.getId());
        List<Long> teamIds = p.getMembers().stream().map(User::getId).collect(Collectors.toList());
        return new ProjectDto(p.getId(), p.getName(), p.getDescription(),
            p.getOwner().getId(), p.getStartDate(), p.getEndDate(),
            p.getStatus(), p.getPriority(), p.getCategory(),
            p.getClientName(), p.getIcon(), p.getColor(),
            p.getProgress(), p.getAiOptimized(),
            teamIds, taskCount, completedCount,
            p.getCreatedAt(), p.getUpdatedAt());
    }
}
