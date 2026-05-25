package com.ntalk.choi.repository;

import com.ntalk.choi.domain.SmsDTO;
import org.apache.ibatis.annotations.Mapper;

/**
 * EM_TRAN 테이블 접근을 위한 MyBatis 매퍼 인터페이스
 */
@Mapper
public interface SmsMapper {

    /**
     * SMS 발송 데이터를 삽입한다.
     * @param smsDTO SMS 발송 데이터
     */
    void insertSms(SmsDTO smsDTO);
}
