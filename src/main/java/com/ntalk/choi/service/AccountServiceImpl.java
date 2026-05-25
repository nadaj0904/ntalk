package com.ntalk.choi.service;

import com.ntalk.choi.domain.AccountDTO;
import com.ntalk.choi.repository.AccountMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * AccountService 구현체
 */
@Service
public class AccountServiceImpl implements AccountService {

    private static final Logger log = LoggerFactory.getLogger(AccountServiceImpl.class);

    private final AccountMapper accountMapper;
    private final PasswordEncoder passwordEncoder;
    private final SmsSendService smsSendService;

    public AccountServiceImpl(AccountMapper accountMapper, PasswordEncoder passwordEncoder, SmsSendService smsSendService) {
        this.accountMapper = accountMapper;
        this.passwordEncoder = passwordEncoder;
        this.smsSendService = smsSendService;
    }

    @Override
    @Transactional
    public AccountDTO login(String email, String password) {
        log.debug("Attempting to login with email: {}", email);
        
        // 1. 이메일로 계정 정보 조회
        AccountDTO account = accountMapper.getAccountByEmail(email);

        // 2. 계정 존재 여부 및 비밀번호 일치 확인 (BCrypt 단방향 암호화 적용)
        if (account != null) {
            log.debug("Found account for email: {}. Validating password...", email);
            if (passwordEncoder.matches(password, account.getPasswordHash())) {
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

    @Override
    @Transactional
    public void resetPassword(String email, String mobile) {
        log.debug("Attempting to reset password for email: {}, mobile: {}", email, mobile);

        // 1. 이메일과 휴대폰 번호로 사용자 조회
        AccountDTO account = accountMapper.getAccountByEmailAndMobile(email, mobile);

        if (account != null) {
            // 2. 임시 비밀번호 생성 (8자리 영문+숫자 무작위)
            String tempPassword = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8);
            log.debug("Generated temporary password for user: {}", email);

            // 3. 비밀번호 해싱 및 DB 업데이트
            String encodedPassword = passwordEncoder.encode(tempPassword);
            accountMapper.updatePassword(account.getAccountId(), encodedPassword);
            log.debug("Updated password in DB for user: {}", email);

            // 4. SMS 발송
            String message = String.format("[ntalk] 임시 비밀번호는 [%s] 입니다. 로그인 후 반드시 비밀번호를 변경해주세요.", tempPassword);
            smsSendService.sendSms(mobile, message);
            log.debug("Sent temporary password SMS to mobile: {}", mobile);
        } else {
            log.warn("Password reset failed: Account not found for email: {}, mobile: {}", email, mobile);
            throw new IllegalArgumentException("입력한 정보와 일치하는 계정이 없습니다.");
        }
    }
}
