package com.ntalk.choi.repository;

import com.ntalk.choi.domain.SendStatDTO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface SendStatMapper {
    // 당일 전체 요약 통계 조회
    SendStatDTO selectTodaySummary();

    // 부서/메시지타입 등 분류별 당일 상세 통계 목록 조회
    List<SendStatDTO> selectTodayDetails();
}
