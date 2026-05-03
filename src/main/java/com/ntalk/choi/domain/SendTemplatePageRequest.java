package com.ntalk.choi.domain;

import java.io.Serializable;

public class SendTemplatePageRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private int page = 1;
    private int size = 20;
    private String keyword;
    private String category;
    private Boolean isActive;

    public SendTemplatePageRequest() {}

    public int getOffset() {
        return (page - 1) * size;
    }

    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }

    public String getKeyword() { return keyword; }
    public void setKeyword(String keyword) { this.keyword = keyword; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
