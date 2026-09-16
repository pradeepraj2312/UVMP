package com.project.uvmp.service;

import com.project.uvmp.dto.ai.AiMatchRecommendation;
import com.project.uvmp.model.Ngo;
import com.project.uvmp.model.Task;
import com.project.uvmp.model.Volunteer;
import com.project.uvmp.repository.NgoRepository;
import com.project.uvmp.repository.TaskAssignmentRepository;
import com.project.uvmp.repository.TaskRepository;
import com.project.uvmp.repository.VolunteerRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiMatchingService {

    private final TaskRepository taskRepository;
    private final VolunteerRepository volunteerRepository;
    private final TaskAssignmentRepository taskAssignmentRepository;
    private final NgoRepository ngoRepository;

    public AiMatchingService(TaskRepository taskRepository,
                             VolunteerRepository volunteerRepository,
                             TaskAssignmentRepository taskAssignmentRepository,
                             NgoRepository ngoRepository) {
        this.taskRepository = taskRepository;
        this.volunteerRepository = volunteerRepository;
        this.taskAssignmentRepository = taskAssignmentRepository;
        this.ngoRepository = ngoRepository;
    }

    public List<AiMatchRecommendation> findTopMatches(Long taskId, Integer limit) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + taskId));

        // Get currently assigned volunteer IDs to exclude them from recommendation list
        Set<Long> assignedVolunteerIds = taskAssignmentRepository.findByTaskId(taskId).stream()
                .map(a -> a.getVolunteerId())
                .collect(Collectors.toSet());

        // Get candidate volunteers (exclude already assigned, prefer AVAILABLE or BUSY)
        List<Volunteer> candidates = volunteerRepository.findAll().stream()
                .filter(v -> !assignedVolunteerIds.contains(v.getId()))
                .filter(v -> !"OFFLINE".equalsIgnoreCase(v.getAvailability()))
                .collect(Collectors.toList());

        Map<Long, String> ngoNames = ngoRepository.findAll().stream()
                .collect(Collectors.toMap(Ngo::getId, Ngo::getName, (a, b) -> a));

        List<String> requiredSkills = parseSkills(task.getRequiredSkills());

        List<AiMatchRecommendation> recommendations = new ArrayList<>();

        for (Volunteer v : candidates) {
            List<String> volunteerSkills = parseSkills(v.getSkills());

            // 1. Skill Match Score (50%)
            List<String> matchedSkills = new ArrayList<>();
            List<String> missingSkills = new ArrayList<>();

            if (requiredSkills.isEmpty()) {
                matchedSkills.addAll(volunteerSkills);
            } else {
                for (String req : requiredSkills) {
                    boolean found = volunteerSkills.stream()
                            .anyMatch(s -> s.toLowerCase().contains(req.toLowerCase()) || req.toLowerCase().contains(s.toLowerCase()));
                    if (found) {
                        matchedSkills.add(req);
                    } else {
                        missingSkills.add(req);
                    }
                }
            }

            double skillScore;
            if (requiredSkills.isEmpty()) {
                skillScore = 90.0;
            } else {
                skillScore = ((double) matchedSkills.size() / requiredSkills.size()) * 100.0;
            }

            // 2. Proximity Score (30%) using Haversine formula
            double distanceKm = calculateHaversineDistance(
                    task.getLatitude(), task.getLongitude(),
                    v.getLatitude(), v.getLongitude()
            );

            double proximityScore;
            if (distanceKm <= 2.0) {
                proximityScore = 100.0;
            } else if (distanceKm <= 25.0) {
                proximityScore = 100.0 - ((distanceKm - 2.0) / 23.0) * 80.0;
            } else {
                proximityScore = Math.max(5.0, 20.0 - (distanceKm - 25.0));
            }

            // 3. Reliability Score (20%)
            double reliabilityScore = v.getReliabilityScore() != null ? v.getReliabilityScore() : 85.0;

            // Composite Score = 50% Skill + 30% Proximity + 20% Reliability
            double compositeScore = (skillScore * 0.50) + (proximityScore * 0.30) + (reliabilityScore * 0.20);
            compositeScore = Math.round(compositeScore * 10.0) / 10.0;

            // Generate human-readable recommendation justification
            String reason = generateReason(matchedSkills, missingSkills, distanceKm, reliabilityScore, v.getAvailability());

            AiMatchRecommendation rec = new AiMatchRecommendation();
            rec.setVolunteerId(v.getId());
            rec.setVolunteerName(v.getName());
            rec.setEmail(v.getEmail());
            rec.setPhone(v.getPhone());
            rec.setNgoId(v.getNgoId());
            rec.setNgoName(v.getNgoId() != null ? ngoNames.getOrDefault(v.getNgoId(), "Independent / Direct") : "Independent / Direct");
            rec.setAvailability(v.getAvailability());
            rec.setLatitude(v.getLatitude());
            rec.setLongitude(v.getLongitude());
            rec.setDistanceKm(Math.round(distanceKm * 10.0) / 10.0);
            rec.setSkillScore(Math.round(skillScore * 10.0) / 10.0);
            rec.setProximityScore(Math.round(proximityScore * 10.0) / 10.0);
            rec.setReliabilityScore(Math.round(reliabilityScore * 10.0) / 10.0);
            rec.setCompositeScore(compositeScore);
            rec.setMatchedSkills(matchedSkills);
            rec.setMissingSkills(missingSkills);
            rec.setRecommendationReason(reason);

            recommendations.add(rec);
        }

        // Sort ranked by compositeScore descending
        recommendations.sort(Comparator.comparingDouble(AiMatchRecommendation::getCompositeScore).reversed());

        int max = limit != null && limit > 0 ? Math.min(limit, recommendations.size()) : recommendations.size();
        return recommendations.subList(0, max);
    }

    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private List<String> parseSkills(String skillsStr) {
        if (skillsStr == null || skillsStr.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.stream(skillsStr.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private String generateReason(List<String> matchedSkills, List<String> missingSkills,
                                  double distanceKm, double reliability, String availability) {
        StringBuilder sb = new StringBuilder();
        if (!matchedSkills.isEmpty()) {
            sb.append("Strong skill alignment (").append(String.join(", ", matchedSkills)).append("). ");
        } else {
            sb.append("General support volunteer. ");
        }

        if (distanceKm <= 3.0) {
            sb.append("Very close proximity (").append(String.format("%.1f", distanceKm)).append(" km). ");
        } else {
            sb.append("Within deployment perimeter (").append(String.format("%.1f", distanceKm)).append(" km). ");
        }

        if (reliability >= 90.0) {
            sb.append("Elite reliability history (").append(String.format("%.0f", reliability)).append("%).");
        } else {
            sb.append("Verified track record (").append(String.format("%.0f", reliability)).append("%).");
        }

        if ("BUSY".equalsIgnoreCase(availability)) {
            sb.append(" Currently on secondary standby.");
        }

        return sb.toString();
    }
}
