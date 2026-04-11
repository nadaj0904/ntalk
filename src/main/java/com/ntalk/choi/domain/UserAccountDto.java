package com.ntalk.choi.domain;

/**
 * 사용자 로그인 데이터 객체
 */
public class UserAccountDto {
    private String adminId;    // 아이디 (이메일)
    private String adminPw;    // 비밀번호
    private String adminName;  // 사용자 이름
    private String adminRole;  // 권한
    
    // Getters and Setters
    public String getAdminId() { return adminId; }
    public void setAdminId(String adminId) { this.adminId = adminId; }
    
    public String getAdminPw() { return adminPw; }
    public void setAdminPw(String adminPw) { this.adminPw = adminPw; }
    
    public String getAdminName() { return adminName; }
    public void setAdminName(String adminName) { this.adminName = adminName; }
    
    public String getAdminRole() { return adminRole; }
    public void setAdminRole(String adminRole) { this.adminRole = adminRole; }
}
