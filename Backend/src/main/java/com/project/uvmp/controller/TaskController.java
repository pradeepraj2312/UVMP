package com.project.uvmp.controller;

import com.project.uvmp.dto.common.ApiResponse;
import com.project.uvmp.dto.task.TaskCreateRequest;
import com.project.uvmp.dto.task.TaskResponse;
import com.project.uvmp.model.Ngo;
import com.project.uvmp.model.Task;
import com.project.uvmp.model.TaskStatus;
import com.project.uvmp.repository.NgoRepository;
import com.project.uvmp.repository.TaskRepository;
import com.project.uvmp.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TaskController {

    private final TaskRepository taskRepository;
    private final NgoRepository ngoRepository;

    public TaskController(TaskRepository taskRepository, NgoRepository ngoRepository) {
        this.taskRepository = taskRepository;
        this.ngoRepository = ngoRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTasks(
            @RequestParam(required = false) Long districtId,
            @RequestParam(required = false) Long ngoId,
            @RequestParam(required = false) TaskStatus status) {

        List<Task> tasks;
        if (districtId != null) {
            tasks = taskRepository.findByDistrictIdOrderByCreatedAtDesc(districtId);
        } else if (ngoId != null) {
            tasks = taskRepository.findByNgoIdOrderByCreatedAtDesc(ngoId);
        } else if (status != null) {
            tasks = taskRepository.findByStatusOrderByCreatedAtDesc(status);
        } else {
            tasks = taskRepository.findAllByOrderByCreatedAtDesc();
        }

        Map<Long, String> ngoNames = ngoRepository.findAll().stream()
                .collect(Collectors.toMap(Ngo::getId, Ngo::getName, (a, b) -> a));

        List<TaskResponse> responses = tasks.stream()
                .map(t -> TaskResponse.fromEntity(t, t.getNgoId() != null ? ngoNames.get(t.getNgoId()) : null))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @Valid @RequestBody TaskCreateRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Long creatorId = userDetails != null ? userDetails.getId() : 1L;

        Task task = new Task(
                request.getTitle(),
                request.getDescription(),
                creatorId,
                request.getDistrictId() != null ? request.getDistrictId() : 1L,
                request.getNgoId(),
                request.getIncidentId(),
                request.getRequiredSkills(),
                request.getLocationAddress(),
                request.getLatitude(),
                request.getLongitude(),
                request.getUrgency(),
                request.getVolunteersNeeded(),
                request.getStartTime(),
                request.getEndTime()
        );

        Task saved = taskRepository.save(task);
        String ngoName = null;
        if (saved.getNgoId() != null) {
            ngoName = ngoRepository.findById(saved.getNgoId()).map(Ngo::getName).orElse(null);
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully.", TaskResponse.fromEntity(saved, ngoName)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable Long id) {
        return taskRepository.findById(id).map(task -> {
            String ngoName = null;
            if (task.getNgoId() != null) {
                ngoName = ngoRepository.findById(task.getNgoId()).map(Ngo::getName).orElse(null);
            }
            return ResponseEntity.ok(ApiResponse.success(TaskResponse.fromEntity(task, ngoName)));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Task not found with ID: " + id)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTaskStatus(
            @PathVariable Long id,
            @RequestParam TaskStatus status) {

        return taskRepository.findById(id).map(task -> {
            task.setStatus(status);
            Task saved = taskRepository.save(task);
            String ngoName = null;
            if (saved.getNgoId() != null) {
                ngoName = ngoRepository.findById(saved.getNgoId()).map(Ngo::getName).orElse(null);
            }
            return ResponseEntity.ok(ApiResponse.success("Task status updated to " + status,
                    TaskResponse.fromEntity(saved, ngoName)));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Task not found with ID: " + id)));
    }
}
