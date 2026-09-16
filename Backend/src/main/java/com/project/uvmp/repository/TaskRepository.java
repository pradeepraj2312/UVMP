package com.project.uvmp.repository;

import com.project.uvmp.model.Task;
import com.project.uvmp.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByDistrictIdOrderByCreatedAtDesc(Long districtId);
    List<Task> findByNgoIdOrderByCreatedAtDesc(Long ngoId);
    List<Task> findByStatusOrderByCreatedAtDesc(TaskStatus status);
    List<Task> findAllByOrderByCreatedAtDesc();
    boolean existsByTitle(String title);
    long countByDistrictId(Long districtId);
    long countByDistrictIdAndStatus(Long districtId, TaskStatus status);
}
