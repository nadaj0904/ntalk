package com.ntalk.choi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ntalk.choi.domain.UserAccountDto;
import com.ntalk.choi.repository.UserAccountMapper;

@Service
public class LoginService {

    @Autowired
    private UserAccountMapper userAccountMapper;

    /**
     * 기본 ID/PW 검증
     * 실제로는 PasswordEncoder 적용이 필수이지만 임시 개발 데이터 연동을 위한 평문 비교
     */
    public UserAccountDto authenticate(String adminId, String adminPw) {
        UserAccountDto user = userAccountMapper.findByAdminId(adminId);
        
        if (user != null && user.getAdminPw().equals(adminPw)) {
            return user; // 인증 성공
        }
        
        return null; // 인증 실패
    }
}
