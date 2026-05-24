package com.ntalk.choi.service;

import com.ntalk.choi.domain.ChannelSendDTO;
import com.ntalk.choi.repository.ChannelSendMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

/**
 * 브랜드 메시지 발송 처리 서비스 클래스
 */
@Service
public class ChannelSendService {

    private final ChannelSendMapper channelSendMapper;

    public ChannelSendService(ChannelSendMapper channelSendMapper) {
        this.channelSendMapper = channelSendMapper;
    }

    /**
     * 브랜드 메시지 발송 데이터 적재
     */
    @Transactional
    public void sendBrandMessage(ChannelSendDTO dto) {
        // 1. 일련번호(SN) 생성: Test-yyyyMMddHHmmssSSS + UUID 8글자
        SimpleDateFormat snFormat = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        String timestamp = snFormat.format(new Date());
        String uuidPart = UUID.randomUUID().toString().substring(0, 8);
        dto.setSn("Test-" + timestamp + "-" + uuidPart);

        // 2. 요청 시간(REQ_DTM) 생성: yyyyMMddHHmmss
        SimpleDateFormat reqFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        dto.setReqDtm(reqFormat.format(new Date()));

        // 3. 기본 타겟팅 타입 설정 (지정되지 않은 경우 'I' 광고주 대상 & 채널 친구 매핑을 기본으로 처리)
        if (dto.getTargetType() == null || dto.getTargetType().trim().isEmpty()) {
            dto.setTargetType("I");
        }

        // 4. DB 테이블 적재
        channelSendMapper.insertBrandMessage(dto);
    }
}
