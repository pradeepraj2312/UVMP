package com.project.uvmp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.project.uvmp.dto.TaskDtos.CreateTaskRequest;
import com.project.uvmp.entity.AppUser;
import com.project.uvmp.entity.Task;
import com.project.uvmp.entity.TaskStatus;
import com.project.uvmp.repository.TaskRepository;
import com.project.uvmp.repository.UserRepository;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskRepository tasks;
    private final UserRepository users;

    public TaskController(TaskRepository tasks, UserRepository users) { this.tasks = tasks; this.users = users; }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public List<Task> mine(Authentication authentication) {
        return tasks.findByAssignedToOrderByDueAtAsc(user(authentication));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DISTRICT_AUTHORITY', 'NGO')")
    public Task create(@RequestBody CreateTaskRequest request, Authentication authentication) {
        Task task = new Task(); task.setTitle(request.title()); task.setDescription(request.description());
        task.setLocation(request.location()); task.setDueAt(request.dueAt()); task.setCreatedBy(user(authentication));
        if (request.assignedToId() != null) task.setAssignedTo(users.findById(request.assignedToId()).orElseThrow());
        return tasks.save(task);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'DISTRICT_AUTHORITY', 'NGO', 'VOLUNTEER')")
    public Task updateStatus(@PathVariable Long id, @RequestBody StatusRequest request) {
        Task task = tasks.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task was not found"));
        task.setStatus(request.status()); return tasks.save(task);
    }

    private AppUser user(Authentication authentication) {
        return users.findByEmailIgnoreCase(authentication.getName()).orElseThrow();
    }

    public record StatusRequest(TaskStatus status) { }
}