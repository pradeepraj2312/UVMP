package com.project.uvmp.dto;

import java.time.Instant;

public final class TaskDtos {
    private TaskDtos() { }
    public record CreateTaskRequest(String title, String description, String location, Instant dueAt, Long assignedToId) { }
}