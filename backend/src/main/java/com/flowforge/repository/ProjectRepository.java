package com.flowforge.repository;

import com.flowforge.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwnerIdOrderByUpdatedAtDesc(Long ownerId);

    @Query("SELECT p FROM Project p WHERE p.category = :category ORDER BY p.updatedAt DESC")
    List<Project> findByCategory(@Param("category") String category);

    @Query("SELECT p FROM Project p WHERE p.status = :status ORDER BY p.updatedAt DESC")
    List<Project> findByStatus(@Param("status") String status);

    @Query("SELECT p FROM Project p JOIN p.members m WHERE m.id = :userId ORDER BY p.updatedAt DESC")
    List<Project> findByMemberId(@Param("userId") Long userId);

    @Query("SELECT p FROM Project p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%',:q,'%'))")
    List<Project> search(@Param("q") String query);
}
