package com.project.uvmp.controller;

import com.project.uvmp.dto.ai.AiMatchRecommendation;
import com.project.uvmp.dto.common.ApiResponse;
import com.project.uvmp.service.AiMatchingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AiMatchingController {

    private final AiMatchingService aiMatchingService;

    public AiMatchingController(AiMatchingService aiMatchingService) {
        this.aiMatchingService = aiMatchingService;
    }

    @GetMapping("/match")
    public ResponseEntity<ApiResponse<List<AiMatchRecommendation>>> getAiMatches(
            @RequestParam Long taskId,
            @RequestParam(defaultValue = "10") Integer limit) {
        List<AiMatchRecommendation> matches = aiMatchingService.findTopMatches(taskId, limit);
        return ResponseEntity.ok(ApiResponse.success("Computed AI 50/30/20 volunteer matches", matches));
    }
}
