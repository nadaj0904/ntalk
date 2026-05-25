package com.ntalk.choi.domain;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * 테이블 TB_NTALK_USER_ACCOUNT 와 매핑되는 계정 정보 DTO
 */
public class AccountDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private UUID accountId;
    private String email;
    private String mobile;
    private String passwordHash;
    private String roleType;
    private LocalDateTime lastLoginAt;
    private String createdId;
    private LocalDateTime createdAt;
    private String updatedId;
    private LocalDateTime updatedAt;
    private String deletedId;
    private LocalDateTime deletedAt;

    // Default Constructor
    public AccountDTO() {}

    // Getters and Setters
    public UUID getAccountId() { return accountId; }
    public void setAccountId(UUID accountId) { this.accountId = accountId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getRoleType() { return roleType; }
    public void setRoleType(String roleType) { this.roleType = roleType; }

    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }

    public String getCreatedId() { return createdId; }
    public void setCreatedId(String createdId) { this.createdId = createdId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getUpdatedId() { return updatedId; }
    public void setUpdatedId(String updatedId) { this.updatedId = updatedId; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getDeletedId() { return deletedId; }
    public void setDeletedId(String deletedId) { this.deletedId = deletedId; }

    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }

    @Override
    public String toString() {
        return "AccountDTO{" +
                "accountId=" + accountId +
                ", email='" + email + '\'' +
                ", roleType='" + roleType + '\'' +
                '}';
    }
}
