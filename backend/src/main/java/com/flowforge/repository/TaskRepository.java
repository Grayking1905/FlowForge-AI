package com.flowforge.repository;

import com.flowforge.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectIdOrderBySortOrderAsc(Long projectId);

    List<Task> findByProjectIdAndStatusOrderBySortOrderAsc(Long projectId, String status);

    List<Task> findByAssigneeIdOrderByDueDateAsc(Long assigneeId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId")
    long countByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId AND t.status = 'COMPLETED'")
    long countCompletedByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT t FROM Task t WHERE t.project.id = :projectId AND t.status = :status ORDER BY t.sortOrder ASC")
    List<Task> findByProjectAndStatus(@Param("projectId") Long projectId, @Param("status") String status);
}
