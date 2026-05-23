package com.ntalk.choi.service;

import com.ntalk.choi.domain.SendStatDTO;
import com.ntalk.choi.repository.SendStatMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SendStatServiceImpl implements SendStatService {

    @Autowired
    private SendStatMapper sendStatMapper;

    @Override
    public Map<String, Object> getTodayStats() {
        Map<String, Object> resultMap = new HashMap<>();
        
        SendStatDTO summary = sendStatMapper.selectTodaySummary();
        if (summary == null) {
            summary = new SendStatDTO();
        }
        
        List<SendStatDTO> details = sendStatMapper.selectTodayDetails();
        
        resultMap.put("summary", summary);
        resultMap.put("details", details);
        
        return resultMap;
    }
}
