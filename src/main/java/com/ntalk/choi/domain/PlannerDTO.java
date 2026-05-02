package com.ntalk.choi.domain;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 플래너 정보 DTO
 * TB_NTALK_USER_PLANNER 테이블 맵핑
 */
public class PlannerDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer plannerId;
    private String name;
    private String plannerCode;
    private String companyCd;
    private String companyName; // TB_CODE 조인용
    private String branchName;
    private String email;
    private String mobile;
    private String licenseInfo;
    private String intro;
    private LocalDateTime deletedAt;
    private String createdId;
    private LocalDateTime createdAt;
    private String updatedId;
    private LocalDateTime updatedAt;

    public PlannerDTO() {}

    public Integer getPlannerId() { return plannerId; }
    public void setPlannerId(Integer plannerId) { this.plannerId = plannerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPlannerCode() { return plannerCode; }
    public void setPlannerCode(String plannerCode) { this.plannerCode = plannerCode; }

    public String getCompanyCd() { return companyCd; }
    public void setCompanyCd(String companyCd) { this.companyCd = companyCd; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getLicenseInfo() { return licenseInfo; }
    public void setLicenseInfo(String licenseInfo) { this.licenseInfo = licenseInfo; }

    public String getIntro() { return intro; }
    public void setIntro(String intro) { this.intro = intro; }

    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }

    public String getCreatedId() { return createdId; }
    public void setCreatedId(String createdId) { this.createdId = createdId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getUpdatedId() { return updatedId; }
    public void setUpdatedId(String updatedId) { this.updatedId = updatedId; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
