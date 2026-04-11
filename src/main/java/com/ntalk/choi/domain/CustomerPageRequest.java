package com.ntalk.choi.domain;

import java.io.Serializable;

/**
 * 고객 목록 페이징 및 검색 조건을 담는 Request DTO
 */
public class CustomerPageRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private int page = 1;          // 현재 페이지 (1부터 시작)
    private int size = 20;         // 페이지당 건수
    private String keyword;        // 통합 검색어 (고객명, 설계사명, 휴대폰)
    private Integer plannerId;     // 설계사별 필터
    private String status;         // 상태 필터 (active, inactive, all)

    // Default Constructor
    public CustomerPageRequest() {}

    /** MyBatis OFFSET 계산용 */
    public int getOffset() {
        return (page - 1) * size;
    }

    // Getters and Setters
    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }

    public String getKeyword() { return keyword; }
    public void setKeyword(String keyword) { this.keyword = keyword; }

    public Integer getPlannerId() { return plannerId; }
    public void setPlannerId(Integer plannerId) { this.plannerId = plannerId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
