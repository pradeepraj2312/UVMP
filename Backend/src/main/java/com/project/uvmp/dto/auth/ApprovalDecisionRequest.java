package com.project.uvmp.dto.auth;

public class ApprovalDecisionRequest {
    private String reason;

    public ApprovalDecisionRequest() {
    }

    public ApprovalDecisionRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
