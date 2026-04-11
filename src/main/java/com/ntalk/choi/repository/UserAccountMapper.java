package com.ntalk.choi.repository;

import org.apache.ibatis.annotations.Mapper;
import com.ntalk.choi.domain.UserAccountDto;

@Mapper
public interface UserAccountMapper {
    /**
     * ID로 사용자 계정 조회
     */
    UserAccountDto findByAdminId(String adminId);
}
