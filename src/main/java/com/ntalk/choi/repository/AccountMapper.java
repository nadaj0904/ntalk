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

    /**
     * 이메일과 휴대폰 번호로 계정을 조회한다.
     * @param email 로그인 이메일
     * @param mobile 휴대폰 번호
     * @return 계정 정보 DTO
     */
    AccountDTO getAccountByEmailAndMobile(@Param("email") String email, @Param("mobile") String mobile);

    /**
     * 비밀번호를 변경한다.
     * @param accountId 계정 고유 ID
     * @param passwordHash 암호화된 비밀번호
     */
    void updatePassword(@Param("accountId") java.util.UUID accountId, @Param("passwordHash") String passwordHash);
}
