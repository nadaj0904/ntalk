package com.ntalk.choi.repository;

import com.ntalk.choi.domain.ChannelSendDTO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 브랜드 메시지 발송용 MyBatis Mapper 인터페이스
 */
@Mapper
public interface ChannelSendMapper {
    int insertBrandMessage(ChannelSendDTO dto);
}
