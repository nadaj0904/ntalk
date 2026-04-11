package com.ntalk.choi.service;

import com.ntalk.choi.domain.AccountDTO;

/**
 * 계정 관리 및 인증 처리를 위한 서비스 인터페이스
 */
public interface AccountService {

    /**
     * 로그인을 처리하고 계정 정보를 반환한다.
     * @param email 로그인 이메일
     * @param password 입력받은 비밀번호 (평문)
     * @return 로그인 성공 시 계정 정보, 실패 시 null
     */
    AccountDTO login(String email, String password);
}
