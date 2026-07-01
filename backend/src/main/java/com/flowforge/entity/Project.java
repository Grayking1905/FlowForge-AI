package com.flowforge.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "projects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(length = 30)
    private String status;

    @Column(length = 20)
    private String priority;

    @Column(length = 30)
    private String category;

    @Column(name = "client_name", length = 100)
    private String clientName;

    @Column(length = 50)
    private String icon;

    @Column(length = 30)
    private String color;

    private Integer progress;

    @Column(name = "ai_optimized")
    private Boolean aiOptimized;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "project_members",
        joinColumns = @JoinColumn(name = "project_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id"))
    @Builder.Default
    private Set<User> members = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Task> tasks = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
        if (status == null) status = "ACTIVE";
        if (priority == null) priority = "MEDIUM";
        if (category == null) category = "INTERNAL";
        if (progress == null) progress = 0;
        if (aiOptimized == null) aiOptimized = false;
        if (icon == null) icon = "folder_open";
        if (color == null) color = "primary";
    }

    @PreUpdate
    protected void onUpdate() { updatedAt = Instant.now(); }
}
