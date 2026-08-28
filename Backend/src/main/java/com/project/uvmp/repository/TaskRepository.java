package com.project.uvmp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.uvmp.entity.AppUser;
import com.project.uvmp.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToOrderByDueAtAsc(AppUser assignedTo);
}