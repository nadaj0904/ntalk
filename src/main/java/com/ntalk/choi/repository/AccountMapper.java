package com.ntalk.choi.repository;

import com.ntalk.choi.domain.AccountDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * TB_NTALK_USER_ACCOUNT 테이블 접근을 위한 MyBatis 매퍼 인터페이스
 */
@Mapper
public interface AccountMapper {

    /**
     * 이메일을 조건으로 계정 정보를 조회한다.
     * @param email 로그인 이메일
     * @return 계정 정보 DTO
     */
    AccountDTO getAccountByEmail(@Param("email") String email);

    /**
     * 최종 로그인 일시를 업데이트한다.
     * @param accountId 계정 고유 ID
     */
    void updateLastLoginAt(@Param("accountId") java.util.UUID accountId);
}
