package com.ntalk.choi.domain;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 테이블 TB_NTALK_USER_CUSTOMER 와 매핑되는 고객 정보 DTO
 */
public class CustomerDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer customerId;
    private Integer plannerId;
    private String name;
    private String mobile;
    private Boolean isActive;
    private String createdId;
    private LocalDateTime createdAt;
    private String updatedId;
    private LocalDateTime updatedAt;
    private String deletedId;
    private LocalDateTime deletedAt;

    // JOIN 조회용 (설계사명)
    private String plannerName;
    private String plannerCode;

    // Default Constructor
    public CustomerDTO() {}

    // Getters and Setters
    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public Integer getPlannerId() { return plannerId; }
    public void setPlannerId(Integer plannerId) { this.plannerId = plannerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

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

    public String getPlannerName() { return plannerName; }
    public void setPlannerName(String plannerName) { this.plannerName = plannerName; }

    public String getPlannerCode() { return plannerCode; }
    public void setPlannerCode(String plannerCode) { this.plannerCode = plannerCode; }

    @Override
    public String toString() {
        return "CustomerDTO{" +
                "customerId=" + customerId +
                ", plannerId=" + plannerId +
                ", name='" + name + '\'' +
                ", mobile='" + mobile + '\'' +
                ", isActive=" + isActive +
                '}';
    }
}
