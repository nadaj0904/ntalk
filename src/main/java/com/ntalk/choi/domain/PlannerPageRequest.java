package com.ntalk.choi.domain;

import java.io.Serializable;

/**
 * 플래너 목록 페이징 및 검색 조건을 담는 Request DTO
 */
public class PlannerPageRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private int page = 1;
    private int size = 20;
    private String keyword;
    private String companyCd;
    
    public PlannerPageRequest() {}

    public int getOffset() {
        return (page - 1) * size;
    }

    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }

    public String getKeyword() { return keyword; }
    public void setKeyword(String keyword) { this.keyword = keyword; }

    public String getCompanyCd() { return companyCd; }
    public void setCompanyCd(String companyCd) { this.companyCd = companyCd; }
}
