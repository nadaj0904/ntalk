package com.ntalk.choi.service;

import com.ntalk.choi.domain.AccountDTO;
import com.ntalk.choi.repository.AccountMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * AccountService 구현체
 */
@Service
public class AccountServiceImpl implements AccountService {

    private static final Logger log = LoggerFactory.getLogger(AccountServiceImpl.class);

    private final AccountMapper accountMapper;

    public AccountServiceImpl(AccountMapper accountMapper) {
        this.accountMapper = accountMapper;
    }

    @Override
    @Transactional
    public AccountDTO login(String email, String password) {
        log.debug("Attempting to login with email: {}", email);
        
        // 1. 이메일로 계정 정보 조회
        AccountDTO account = accountMapper.getAccountByEmail(email);

        // 2. 계정 존재 여부 및 비밀번호 일치 확인 (단순 문자열 비교 지침 준수)
        if (account != null) {
            log.debug("Found account for email: {}. Validating password...", email);
            if (account.getPasswordHash().equals(password)) {
                log.debug("Password validation successful for email: {}", email);
                // 3. 로그인 성공 시 최종 로그인 일시 업데이트
                accountMapper.updateLastLoginAt(account.getAccountId());
                log.debug("Updated last_login_at for account: {}", email);
                return account;
            } else {
                log.debug("Password mismatch for email: {}", email);
            }
        } else {
            log.debug("Account not found for email: {}", email);
        }

        // 4. 실패 시 null 반환
        return null;
    }
}
