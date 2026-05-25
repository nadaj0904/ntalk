package com.ntalk.choi.service;

import com.ntalk.choi.domain.SmsDTO;
import com.ntalk.choi.repository.SmsMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * SMS 메시지 발송 처리 서비스 클래스
 */
@Service
public class SmsSendService {

    private final SmsMapper smsMapper;

    public SmsSendService(SmsMapper smsMapper) {
        this.smsMapper = smsMapper;
    }

    /**
     * SMS 발송 데이터를 EM_TRAN 테이블에 적재
     * @param phone 수신자 휴대폰 번호
     * @param message 발송할 메시지 내용
     */
    @Transactional
    public void sendSms(String phone, String message) {
        SmsDTO dto = new SmsDTO();
        dto.setTranPhone(phone);
        dto.setTranCallback("18770039"); // 기본 발신번호 (가이드 참고)
        dto.setTranStatus(1);            // 발송 대기 상태
        dto.setTranType(4);              // SMS 타입
        dto.setTranMsg(message);

        smsMapper.insertSms(dto);
    }
}
