package com.ntalk.choi.domain;

import java.io.Serializable;
import java.sql.Timestamp;

public class SendTemplateDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer templateId;
    private String title;
    private String contentText;
    private String imageUrl;
    private String category;
    private Boolean isActive;
    private Timestamp deletedAt;

    public SendTemplateDTO() {}

    public Integer getTemplateId() { return templateId; }
    public void setTemplateId(Integer templateId) { this.templateId = templateId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContentText() { return contentText; }
    public void setContentText(String contentText) { this.contentText = contentText; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Timestamp getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Timestamp deletedAt) { this.deletedAt = deletedAt; }
}
