package com.project.uvmp.repository;

import com.project.uvmp.model.TaskAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, Long> {
    List<TaskAssignment> findByTaskId(Long taskId);
    List<TaskAssignment> findByVolunteerId(Long volunteerId);
    Optional<TaskAssignment> findByTaskIdAndVolunteerId(Long taskId, Long volunteerId);
    boolean existsByTaskIdAndVolunteerId(Long taskId, Long volunteerId);
    void deleteByTaskIdAndVolunteerId(Long taskId, Long volunteerId);
    long countByTaskId(Long taskId);
}
